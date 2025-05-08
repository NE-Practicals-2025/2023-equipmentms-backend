import { ErrorRequestHandler, RequestHandler, Router } from "express";
import userController from "../controllers/user.controller";
import {
  ChangePasswordDTO,
  CreateUserDTO,
  UpdateAvatarDTO,
  UpdateUserDTO,
} from "../dtos/user.dto";
import { checkAdmin, checkLoggedIn } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validator.middleware";
import employeesController from "../controllers/employees.controller";
import { RegisterEmployeeDTO } from "../dtos/employee.dto";

const employeesRouter = Router();

employeesRouter.post(
  "/register",
  [checkLoggedIn, validationMiddleware(RegisterEmployeeDTO)],
  employeesController.registerEmployee,
);
employeesRouter.put(
  "/update",
  [checkLoggedIn, validationMiddleware(UpdateUserDTO)],
  employeesController.updateEmployee,
);
employeesRouter.get(
  "/all",
  [checkLoggedIn],
  employeesController.getAllEmployees,
);
employeesRouter.get("/:id", [checkLoggedIn], employeesController.getById);
employeesRouter.get(
  "/search/:query",
  [checkLoggedIn],
  employeesController.searchEmployee,
);
employeesRouter.delete(
  "/by-id/:id",
  [checkLoggedIn],
  employeesController.deleteEmployeeById,
);

export default employeesRouter;
