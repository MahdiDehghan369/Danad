import { NextFunction, Request, Response } from "express";
import { createDepartmentService } from "./department.service";
import { successResponse } from "../../utils/response";

export const createDepartment = async(req: Request , res: Response , next: NextFunction) => {
    try {

        const data = req.body

        const result = await createDepartmentService(data)

        return successResponse(res, 200 , "Department created successfully", result)
        
    } catch (error) {
        next(error)
    }
}