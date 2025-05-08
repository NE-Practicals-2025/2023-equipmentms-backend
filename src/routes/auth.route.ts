import { RequestHandler, Router } from "express";
import authController from "../controllers/auth.controller";
import {
  InitiateResetPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  VerifyCodeDTO,
} from "../dtos/auth.dto";
import { checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";

const authRouter = Router();

authRouter.post(
  "/login",
  [validationMiddleware(LoginDTO)],
  authController.login,
);
authRouter.patch(
  "/initiate-reset-password",
  [validationMiddleware(InitiateResetPasswordDTO)],
  authController.initiateResetPassword,
);
authRouter.patch(
  "/reset-password",
  [validationMiddleware(ResetPasswordDTO)],
  authController.resetPassword,
);
authRouter.patch(
  "/initiate-email-verification",
  [checkLoggedIn],
  authController.initiateEmailVerification,
);
authRouter.patch(
  "/verify-email/:code",
  [checkLoggedIn],
  authController.verifyEmail,
);
authRouter.patch(
  "/verify-code",
  [validationMiddleware(VerifyCodeDTO)],
  authController.verifyCode,
);

export default authRouter;
