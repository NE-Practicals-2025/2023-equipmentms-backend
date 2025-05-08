import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import employeesRouter from "./employees.route";

const router = Router()

router.use("/auth", authRouter
    /*
        #swagger.tags = ['Auth']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/user", userRouter
    /*
        #swagger.tags = ['Users']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
router.use("/employees", employeesRouter
    /*
        #swagger.tags = ['Employees']
        #swagger.security = [{
                "bearerAuth": []
        }] 
    */
)
export default router