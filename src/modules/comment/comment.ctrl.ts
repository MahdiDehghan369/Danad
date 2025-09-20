import { NextFunction, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { changeStatusCommentService, createCommentService, dislikeCommentServie, likeCommentServie, removeCommentService } from "./comment.service";
import { successResponse } from "../../utils/response";

export const createComment = async(req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        const data = req.body
        data.user = req.user?._id as string

        const result = await createCommentService(data)

        return successResponse(res, 200 , "Comment created successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const likeComment = async(req: ICustomRequest , res: Response, next: NextFunction) => {
    try {

        const result = await likeCommentServie(req.user?._id as string , req.params.commentId)

        return successResponse(res, 200 , "successfully" , result)
        
    } catch (error) {
        next(error)
    }
}

export const dislikeComment = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await dislikeCommentServie(
      req.user?._id as string,
      req.params.commentId
    );

    return successResponse(res, 200, "successfully", result);
  } catch (error) {
    next(error);
  }
};

export const changeStatusComment = async (req: ICustomRequest , res: Response , next: NextFunction) => {

    try {

        const result = await changeStatusCommentService(req.user?._id as string , req.params.commentId , req.body.status)

        return successResponse(res, 200 , "Status changed successfully" , result)
        
    } catch (error) {
        next(error)
    }

}

export const removeComment = async (req: ICustomRequest , res: Response , next: NextFunction) => {
    try {

        await removeCommentService(req.user?._id as string , req.params.commentId)

        return successResponse(res, 200 , "Comment removed successfully")
        
    } catch (error) {
        next(error)
    }
}