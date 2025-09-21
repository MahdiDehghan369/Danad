import { Types } from "mongoose";
import { AppError } from "../../utils/appError";
import { courseRepo } from "../course/course.repo";
import { purchasedCourseRepo } from "../purchasedCourse/purchasedCourse.repo";
import { userRepo } from "../user/user.repo";
import { commentRepo, ICreateComment } from "./comment.repo";

export const createCommentService = async (data: ICreateComment) => {
  const user = await userRepo.findById(data.user);

  if (!user) throw new AppError("User not found", 404);

  const course = await courseRepo.findOne({
    _id: data.course,
    $or: [{ status: "completed" }, { status: "pending" }],
  });

  if (!course) throw new AppError("Course not found", 404);

  if (data.parentComment) {
    const comment = await commentRepo.findOne({ _id: data.parentComment });

    if (!comment) throw new AppError("parent comment not found", 404);
  }

  const userBoughtCourse = await purchasedCourseRepo.findOne({
    user: data.user,
    course: data.course,
  });

  if (user.role === "admin") {
    data.role = "admin";
  } else if (user.role === "teacher") {
    data.role = "teacher";
  } else if (userBoughtCourse) {
    data.role = "student";
  } else {
    data.role = "user";
  }

  const comment = await commentRepo.create(data);

  return { comment };
};

export const likeCommentServie = async (userId: string, commentId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const comment = await commentRepo.findOne({ _id: commentId });

  if (!comment) throw new AppError("Comment not found", 404);

  comment.dislikesUsers = comment.dislikesUsers.filter(
    (user) => user.toString() !== userId.toString()
  );

  const userLikedIt = comment.likesUsers.find(
    (user) => user.toString() === userId.toString()
  );

  if (userLikedIt) {
    comment.likesUsers = comment.likesUsers.filter(
      (user) => user.toString() !== userId.toString()
    );
  }

  if (!userLikedIt) {
    comment.likesUsers.push(new Types.ObjectId(userId));
  }

  comment.likes = comment.likesUsers.length;
  comment.dislikes = comment.dislikesUsers.length;

  await comment.save();

  return { comment };
};

export const dislikeCommentServie = async (userId: string, commentId: string) => {
  const user = await userRepo.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const comment = await commentRepo.findOne({ _id: commentId });

  if (!comment) throw new AppError("Comment not found", 404);

  comment.likesUsers = comment.likesUsers.filter(
    (user) => user.toString() !== userId.toString()
  );

  const userDislikedIt = comment.dislikesUsers.find(
    (user) => user.toString() === userId.toString()
  );

  if (userDislikedIt) {
    comment.dislikesUsers = comment.dislikesUsers.filter(
      (user) => user.toString() !== userId.toString()
    );
  }

  if (!userDislikedIt) {
    comment.dislikesUsers.push(new Types.ObjectId(userId));
  }

  comment.likes = comment.likesUsers.length;
  comment.dislikes = comment.dislikesUsers.length;

  await comment.save();

  return { comment };
};

export const changeStatusCommentService = async (userId: string , commentId: string , status: "approved" | "rejected") => {

    const user = await userRepo.findById(userId)

    if(!user) throw new AppError("User not found" , 404)

    const comment = await commentRepo.findOne({_id: commentId})

    if(!comment) throw new AppError("Comment not found" , 404)

    const course = await courseRepo.findOne({_id:comment.course})

    if(!course) throw new AppError("Course not found" , 404)

    if (
      user.role !== "admin" && 
      !(
        user.role === "teacher" &&
        course.teacher.toString() === userId.toString()
      )
    ) {
      throw new AppError(
        "You do not have permission to approve/reject this comment",
        403
      );
    }


    comment.status = status

    await comment.save()

    return {comment}
}

export const removeCommentService = async (userId: string , commentId: string) => {
     const user = await userRepo.findById(userId);

     if (!user) throw new AppError("User not found", 404);

     const comment = await commentRepo.findOne({ _id: commentId });

     if (!comment) throw new AppError("Comment not found", 404);

     const course = await courseRepo.findOne({ _id: comment.course });

     if (!course) throw new AppError("Course not found", 404);

     if (
       user.role !== "admin" &&
       !(
         user.role === "teacher" &&
         course.teacher.toString() === userId.toString()
       )
     ) {
       throw new AppError(
         "You do not have permission to remove this comment",
         403
       );
     }


    await commentRepo.deleteOne({_id: commentId})


}

export const getCommentsService = async (
  userId: string,
  filters: { status?: string; course?: string; page?: number; limit?: number }
) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const { status, course, page = 1, limit = 10 } = filters;

  let filterObj: any = {};
  if (status) filterObj.status = status;
  if (course) filterObj.course = course;

  if (user.role === "teacher") {
    const teacherCourses = await courseRepo.find({ teacher: user._id });
    const teacherCourseIds = teacherCourses.map((c: any) => c._id);
    filterObj.course = { $in: teacherCourseIds };
  } else if (user.role !== "admin") {
    throw new AppError("You do not have permission to view comments", 403);
  }

  return await commentRepo.find(filterObj, page, limit);
};