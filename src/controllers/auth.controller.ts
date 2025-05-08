import { compare, compareSync, hash } from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import {
  sendAccountVerificationEmail,
  sendPaswordResetEmail,
} from "../utils/mail";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return ServerResponse.error(res, "Invalid email or password");
    const isMatch = compareSync(password, user.password);
    if (!isMatch) return ServerResponse.error(res, "Invalid email or password");
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "3d" },
    );
    return ServerResponse.success(res, "Login successful", { user, token });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const initiateResetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const passwordResetCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6 hours
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return ServerResponse.error(res, "Invalid email");
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetCode,
        passwordResetExpires,
      },
    });
    await sendPaswordResetEmail(email, user.names, passwordResetCode);
    return ServerResponse.success(
      res,
      "Password reset email sent successfully",
    );
  } catch (error) {
    console.log(error);
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user) return ServerResponse.error(res, "Invalid email");
    if (user.passwordResetStatus !== "VERIFIED")
      return ServerResponse.error(res, "Verify code first!");
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetStatus: "IDLE",
      },
    });
    return ServerResponse.success(res, "Password reset successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const initiateEmailVerification: any = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 6); // 6 hours
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        verificationCode,
        verificationExpires,
        verificationStatus: "PENDING",
      },
    });
    await sendAccountVerificationEmail(
      user.email,
      user.names,
      verificationCode,
    );
    return ServerResponse.success(res, "Verification email sent successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code,
        verificationExpires: { gte: new Date() },
      },
    });
    console.log(user);
    if (!user) return ServerResponse.error(res, "Invalid or expired code");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationStatus: "VERIFIED",
        verificationCode: null,
        verificationExpires: null,
      },
    });
    return ServerResponse.success(res, "Verification successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};
const verifyCode = async (req: Request, res: Response) => {
  try {
    const { code, email } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        passwordResetCode: code,
        passwordResetExpires: { gte: new Date() },
      },
    });
    console.log("verify code user --> ", user);
    if (!user) return ServerResponse.error(res, "Invalid or expired code");
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCode: null,
        passwordResetExpires: null,
        passwordResetStatus: "VERIFIED",
      },
    });
    return ServerResponse.success(res, "Verification successfully");
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const authController = {
  login,
  initiateResetPassword,
  resetPassword,
  initiateEmailVerification,
  verifyEmail,
  verifyCode,
};

export default authController;
