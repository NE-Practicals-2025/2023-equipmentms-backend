import { compareSync, hashSync } from "bcrypt";
import { config } from "dotenv";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";

config()

const registerEmployee = async (req: Request, res: Response) => {
    try {
        const { email, firstName, lastName, telephone, serialNumber, nationalId , laptopManufacturer, laptopModel, department, position } = req.body
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
                position
            }
        })
        return ServerResponse.created(res, "Employee registered successfully", { employee })
    } catch (error: any) {
        console.log("error", error)
        if (error.code === 'P2002') {
            const key = error.meta.target[0]
            return ServerResponse.error(res, `${key.charAt(0).toUpperCase() + key.slice(1)} (${req.body[key]}) already exists`, 400);
        }
        return ServerResponse.error(res, "Error occured", { error })
    }
}

const updateEmployee: any = async (req: AuthRequest, res: Response) => {
    try {
        const { employeeId, email, firstName, lastName, telephone, serialNumber, nationalId , laptopManufacturer, laptopModel, department, position } = req.body;
        const employeeExisting = await prisma.employee.findFirst({
            where: {id: employeeId}
        })
        if(!employeeExisting){
            ServerResponse.error(res, `Employee with id ${employeeId} is not found!`)
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
                position
            }
        })
        return ServerResponse.success(res, "Employee updated successfully", { employee })
    } catch (error: any) {
        if (error.code === 'P2002') {
            const key = error.meta.target[0]
            return ServerResponse.error(res, `${key.charAt(0).toUpperCase() + key.slice(1)} (${req.body[key]}) already exists`, 400);
        }
        return ServerResponse.error(res, "Error occurred", { error })
    }
}


const all = async (req: Request, res: Response) => {
    try {
        const employees = await prisma.user.findMany({})
        return ServerResponse.success(res, "Employees fetched successfully", { employees })
    } catch (error) {
        return ServerResponse.error(res, "Error occurred", { error })
    }
}

const getById = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } })
        return ServerResponse.success(res, "User fetched successfully", { user })
    } catch (error) {
        return ServerResponse.error(res, "Error occured", { error })
    }
}

const searchEmployee = async (req: Request, res: Response) => {
    try {
        const { query } = req.params
        const users = await prisma.user.findMany({ where: { names: { contains: query, mode: 'insensitive' } } })
        return ServerResponse.success(res, "Users fetched successfully", { users })
    } catch (error) {
        return ServerResponse.error(res, "Error occured", { error })
    }
}

const deleteEmployeeById = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.delete({ where: { id: req.params.id } })
        return ServerResponse.success(res, "User deleted successfully", { user })
    } catch (error) {
        return ServerResponse.error(res, "Error occured", { error })
    }
}

const employeesController = {
    registerEmployee,
    updateEmployee,
    all,
    getById,
    searchEmployee,
    deleteEmployeeById,
}

export default employeesController;