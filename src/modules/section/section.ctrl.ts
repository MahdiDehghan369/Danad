import { NextFunction, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import {
  addSessionToSectionService,
  changeStatusSectionService,
  createSessionService,
  editSectionService,
  getSectionService,
  getSessionsService,
  removeSectionService,
} from "./section.service";
import { successResponse } from "../../utils/response";
import { ISessionFilter } from "../session/session.repo";

export const createSession = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const data = req.body;
    data.section = req.params.sectionId;
    data.createdBy = req.user?._id as string;

    const result = await createSessionService(files, req.body);

    return successResponse(res, 200, " session created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = req.params.sectionId;

    const result = await getSessionsService(sectionId, req.query);

    return successResponse(res, 200, "Get sessions successfully", result);
  } catch (error) {
    next(error);
  }
};

export const getSection = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = req.params.sectionId;
    const result = await getSectionService(sectionId);

    return successResponse(res, 200, "Get section successfully", result);
  } catch (error) {
    next(error);
  }
};

export const changeStatusSection = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = req.params.sectionId;

    const result = await changeStatusSectionService(sectionId, req.body.status);

    return successResponse(
      res,
      200,
      "Section status changed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const editSection = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = req.params.sectionId;

    const result = await editSectionService(sectionId, req.body);

    return successResponse(res, 200, "Edited successfully", result);
  } catch (error) {
    next(error);
  }
};

export const removeSection = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = req.params.sectionId;

    await removeSectionService(sectionId);

    return successResponse(res, 200, "Section removed successfully");
  } catch (error) {
    next(error);
  }
};

export const addSessionToSection = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sectionId = req.params.sectionId;
    const sessionId = req.params.sessionId;

    await addSessionToSectionService(sectionId, sessionId)

    return successResponse(res, 200, "Added successfully")

  } catch (error) {
    next(error);
  }
};
