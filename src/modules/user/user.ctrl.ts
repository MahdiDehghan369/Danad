import { NextFunction, Request, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import {
  changePasswordService,
  changeUserRoleService,
  editUserInfoService,
  getActiveAccountsService,
  getUserCoursesService,
  getUserInfoService,
  getUsersService,
  removeAccountService,
  removeAllAccountsService,
  removeProfileService,
  removeUserService,
  setProfileService,
} from "./user.service";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/appError";
import { IGetUsersQuery } from "./user.repo";

export const changePassword = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const { currentPassword, newPassword } = req.body;

    await changePasswordService(userId as string, currentPassword, newPassword);

    return successResponse(res, 200, "Password changed successfully :)");
  } catch (error) {
    next(error);
  }
};

export const editUserInfo = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const result = await editUserInfoService(userId as string, req.body);

    return successResponse(res, 200, "User updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (req.user?._id == userId.toString())
      throw new AppError("You can't remove yourself", 400);

    const result = await removeUserService(userId);

    return successResponse(res, 200, "User removed successfully :)", {
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const result = await getUserInfoService(userId);

    return successResponse(res, 200, "Fetch user info successfully :)", result);
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    if (req.user?._id == userId.toString())
      throw new AppError("You can't change your role :|", 400);

    const { role } = req.body;

    await changeUserRoleService(userId, role);

    return successResponse(res, 200, "Role changed successfully");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query: IGetUsersQuery = req.query;
    const result = await getUsersService(query);

    return successResponse(res, 200, "Get users successfully", result);
  } catch (error) {
    next(error);
  }
};

export const setProfile = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const filename = req.file?.filename;
    const userId = req.user?._id;

    const result = await setProfileService(userId as string, filename);
    return successResponse(res, 200, "Uploded profile successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeProfile = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    await removeProfileService(userId as string);

    return successResponse(res, 200, "Profile removed successfully");
  } catch (error) {
    next(error);
  }
};

export const getActiveAccounts = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const result = await getActiveAccountsService(userId as string);

    return successResponse(res, 200, "Get active acounts successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeAcount = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { accountId } = req.params;

    const result = await removeAccountService(userId as string, accountId);

    return successResponse(res, 200, "Acount deleted successfully :)");
  } catch (error) {
    next(error);
  }
};

export const removeAllAccounts = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    await removeAllAccountsService(userId as string);

    return successResponse(
      res,
      200,
      "All active accounts removed successfully :)"
    );
  } catch (error) {
    next(error);
  }
};

export const getUserCourses = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id as string;

    const result = await getUserCoursesService(userId);

    return successResponse(res, 200, "Get user courses successfully", result);
  } catch (error) {
    next(error);
  }
};
