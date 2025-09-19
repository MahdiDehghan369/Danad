import { NextFunction, Request, Response } from "express";
import { createDepartmentService, editDepartmentService, removeDepartmentService } from "./department.service";
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

export const editDepartment = async(req: Request , res: Response , next: NextFunction) => {
    try {

        const data = req.body
        const departmentId = req.params.departmentId

        const result = await editDepartmentService(departmentId , data);

        return successResponse(res, 200, "Department updated successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const removeDepartment = async (req: Request , res: Response , next: NextFunction) => {
    try {
        
         const departmentId = req.params.departmentId;

         const result = await removeDepartmentService(departmentId);

         return successResponse(
           res,
           200,
           "Department removed successfully"
         );

    } catch (error) {
        next(error)
    }
}