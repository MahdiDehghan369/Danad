import { NextFunction, Response } from "express";
import { ICustomRequest } from "../../middlewares/auth";
import { changeStatusCommentService, createCommentService, dislikeCommentServie, getCommentService, getCommentsService, likeCommentServie, removeCommentService } from "./comment.service";
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

export const getComments = async (req: ICustomRequest, res: Response , next: NextFunction) => {
  try {
    const userId = req.user?._id as string;
    const { status, course, page, limit } = req.query;

    const result = await getCommentsService(userId, {
      status: status as string,
      course: course as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    return successResponse(res, 200, "Comments fetched successfully", result);
    
  } catch (error) {
    next(error)
  }
};

export const getComment = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const userId = req.user?._id as string
    const commentId = req.params.commentId

    const result = await getCommentService(userId , commentId)

    return successResponse(res, 200 , "Get successfully" , result)
    
  } catch (error) {
    next(error)
  }
}