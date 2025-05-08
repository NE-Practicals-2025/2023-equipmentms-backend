import { compareSync, hashSync } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { pagination } from "../utils/pagination";

config();

const registerEmployee = async (req: Request, res: Response) => {
  try {
    const {
      email,
      firstName,
      lastName,
      telephone,
      serialNumber,
      nationalId,
      laptopManufacturer,
      laptopModel,
      department,
      position,
    } = req.body;
    const employee = await prisma.employee.create({
      data: {
        email,
        firstName,
        telephone,
        laptopManufacturer,
        laptopModel,
        lastName,
        serialNumber,
        nationalId,
        department,
        position,
      },
    });
    return ServerResponse.created(res, "Employee registered successfully", {
      employee,
    });
  } catch (error: any) {
    console.log("error", error);
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${req.body[key]}) already exists`,
        400,
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const updateEmployee: any = async (req: AuthRequest, res: Response) => {
  try {
    const {
      employeeId,
      email,
      firstName,
      lastName,
      telephone,
      serialNumber,
      nationalId,
      laptopManufacturer,
      laptopModel,
      department,
      position,
    } = req.body;
    const employeeExisting = await prisma.employee.findFirst({
      where: { id: employeeId },
    });
    if (!employeeExisting) {
      ServerResponse.error(res, `Employee with id ${employeeId} is not found!`);
    }
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        email,
        firstName,
        telephone,
        laptopManufacturer,
        laptopModel,
        lastName,
        serialNumber,
        nationalId,
        department,
        position,
      },
    });
    return ServerResponse.success(res, "Employee updated successfully", {
      employee,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${req.body[key]}) already exists`,
        400,
      );
    }
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const employees = await prisma.employee.findMany({
      skip: ((page > 0 ? page : 1) - 1) * limit,
      take: limit,
    });

    const totalEmployees = await prisma.employee.count();

    return ServerResponse.success(res, "Employees fetched successfully", {
      employees,
      meta: pagination({
        page,
        limit,
        total: totalEmployees,
      }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", {
      error: "Error Occurred",
    });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
    });
    return ServerResponse.success(res, "Employee fetched successfully", {
      employee,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const searchEmployee = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;
    const employee = await prisma.employee.findMany({
      where: {
        firstName: { contains: query, mode: "insensitive" },
        lastName: { contains: query, mode: "insensitive" },
        email: { contains: query, mode: "insensitive" },
        telephone: { contains: query, mode: "insensitive" },
        department: { contains: query, mode: "insensitive" },
        position: { contains: query, mode: "insensitive" },
        nationalId: { contains: query, mode: "insensitive" },
        laptopManufacturer: { contains: query, mode: "insensitive" },
        laptopModel: { contains: query, mode: "insensitive" },
        serialNumber: { contains: query, mode: "insensitive" },
      },
    });
    return ServerResponse.success(res, "Employee fetched successfully", {
      employee,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const deleteEmployeeById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({ where: { id: req.params.id } });
    return ServerResponse.success(res, "User deleted successfully", { user });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const employeesController = {
  registerEmployee,
  updateEmployee,
  getAllEmployees,
  getById,
  searchEmployee,
  deleteEmployeeById,
};

export default employeesController;
