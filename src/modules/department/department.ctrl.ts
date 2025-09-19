import { NextFunction, Request, Response } from "express";
import {
  changeStatusDepartmentService,
  createDepartmentService,
  editDepartmentService,
  getAllDepartmentService,
  getDepartmentService,
  getDepartmentsAdminService,
  removeDepartmentService,
} from "./department.service";
import { successResponse } from "../../utils/response";

export const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const result = await createDepartmentService(data);

    return successResponse(res, 200, "Department created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const editDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const departmentId = req.params.departmentId;

    const result = await editDepartmentService(departmentId, data);

    return successResponse(res, 200, "Department updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.departmentId;

    const result = await removeDepartmentService(departmentId);

    return successResponse(res, 200, "Department removed successfully");
  } catch (error) {
    next(error);
  }
};

export const getDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.departmentId;

    const result = await getDepartmentService(departmentId);

    return successResponse(res, 200, "Get info successfully", result);
  } catch (error) {
    next(error);
  }
};

export const changeStatusDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departmentId = req.params.departmentId;

    const result = await changeStatusDepartmentService(departmentId);

    return successResponse(res, 200, "status changed successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getDepartmentsAdmin = async (req: Request , res: Response , next: NextFunction) => {
    try {

        const result = await getDepartmentsAdminService(req.query);

        return successResponse(res , 200 , "Get successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const getAllDepartment = async (req: Request , res: Response , next: NextFunction) => {
    try {

        const result = await getAllDepartmentService()

        return successResponse(res, 200 , "Get all departments successfully" , result)
        
    } catch (error) {
        next(error)
    }
}