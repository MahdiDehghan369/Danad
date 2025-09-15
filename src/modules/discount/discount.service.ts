import { AppError } from "../../utils/appError";
import { courseRepo } from "../course/course.repo";
import { courseDiscountRepo, ICreateDiscount } from "./discount.repo";

export const createCourseDiscountService = async (data: ICreateDiscount) => {
  if (data.scope === "single") {
    const course = await courseRepo.findOne({ _id: data.course });
    if (!course) throw new AppError("Course not found", 404);

    if(course.price === 0) throw new AppError("Cannot create discount for a free course", 400);

    const activeDiscount = await courseDiscountRepo.findOne({
      course: data.course,
      isActive: true,
      endAt: { $gt: new Date() },
    });
    if (activeDiscount) {
      throw new AppError("This course already has an active discount", 409);
    }

    if (data.type === "fixed" && data.value >= course.price) {
      throw new AppError(
        "Fixed discount cannot be greater than course price",
        400
      );
    }

    const courseDiscount = await courseDiscountRepo.create(data);

    return { discount: courseDiscount };
  } else if (data.scope === "all") {
    const activeGlobalDiscount = await courseDiscountRepo.findOne({
      scope: "all",
      isActive: true,
      endAt: { $gt: new Date() },
    });

    if (activeGlobalDiscount) {
      throw new AppError("There is already an active global discount", 409);
    }
    const courseDiscount = await courseDiscountRepo.create(data);

    return { discount: courseDiscount };
  }
};