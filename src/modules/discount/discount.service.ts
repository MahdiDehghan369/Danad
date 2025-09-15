import { AppError } from "../../utils/appError";
import { courseRepo } from "../course/course.repo";
import { courseDiscountRepo, ICreateDiscount, IUpdateDiscount } from "./discount.repo";

interface IGetDiscounts {
  scope?: "all" | "single";
  type?: "percent" | "fixed";
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const createCourseDiscountService = async (data: ICreateDiscount) => {
  if (data.scope === "single") {
    const course = await courseRepo.findOne({ _id: data.course });
    if (!course) throw new AppError("Course not found", 404);

    if (course.price === 0)
      throw new AppError("Cannot create discount for a free course", 400);

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

export const removeCourseDiscountService = async (discountId: string) => {
  const discount = await courseDiscountRepo.findOne({ _id: discountId });

  if (!discount) throw new AppError("Discount not found", 404);

  await courseDiscountRepo.deleteOne({ _id: discountId });
};

export const changeStatusDiscountService = async (discountId: string) => {
  const discount = await courseDiscountRepo.findOne({ _id: discountId });

  if (!discount) throw new AppError("Discount not found", 404);

  const isActive = !discount.isActive;

  if (isActive) {
    if (discount.scope === "all") {
      const activeGlobalDiscount = await courseDiscountRepo.findOne({
        scope: "all",
        isActive: true,
        endAt: { $gt: new Date() },
      });

      if (activeGlobalDiscount)
        throw new AppError("There is already an active global discount", 409);
    } else if (discount.scope === "single") {
      const activeDiscount = await courseDiscountRepo.findOne({
        scope: "single",
        course: discount.course,
        isActive: true,
        endAt: { $gt: new Date() },
      });

      if (activeDiscount)
        throw new AppError(
          "There is already an active discount for this course",
          409
        );
    }
  }

  const updatedDiscount = await courseDiscountRepo.findOneAndUpdate(
    { _id: discountId },
    { isActive },
  );

  return { discount: updatedDiscount };
};

export const getCourseDiscountService = async (discountId: string) => {

  const discount = await courseDiscountRepo.findOne({_id: discountId})

  if(!discount) throw new AppError("Discount not found" , 404)

    return {discount}

}

export const updateCourseDiscountService = async (
  discountId: string,
  data: IUpdateDiscount
) => {
  const discount = await courseDiscountRepo.findOne({ _id: discountId });
  if (!discount) throw new AppError("Discount not found", 404);

  if (data.isActive && !discount.isActive) {
    if (discount.scope === "all") {
      const activeGlobalDiscount = await courseDiscountRepo.findOne({
        scope: "all",
        isActive: true,
        endAt: { $gt: new Date() },
      });
      if (activeGlobalDiscount)
        throw new AppError("There is already an active global discount", 409);
    } else if (discount.scope === "single") {
      const activeDiscount = await courseDiscountRepo.findOne({
        scope: "single",
        course: discount.course,
        isActive: true,
        endAt: { $gt: new Date() },
      });
      if (activeDiscount)
        throw new AppError(
          "There is already an active discount for this course",
          409
        );
    }
  }

  if (data.type === "fixed" && discount.scope === "single") {
    const coursePrice = (discount.course as any).price;
    if (data.value != null && data.value >= coursePrice) {
      throw new AppError(
        "Fixed discount cannot be greater than course price",
        400
      );
    }
  }


  const updatedDiscount = await courseDiscountRepo.findOneAndUpdate(
    { _id: discountId },
    data
  );

  return { discount: updatedDiscount };
};

export const getCourseDiscountsService = async (filters: IGetDiscounts) => {
  const { page = 1, limit = 10, ...restFilters } = filters;

  const mongoFilter: any = {};
  if (restFilters.scope) mongoFilter.scope = restFilters.scope;
  if (restFilters.type) mongoFilter.type = restFilters.type;
  if (restFilters.isActive !== undefined)
    mongoFilter.isActive = restFilters.isActive;

  const skip = (page - 1) * limit;

  const { discounts, total } = await courseDiscountRepo.find(mongoFilter, {
    skip,
    limit,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    discounts,
    page,
    limit,
    total,
    totalPages,
  };
};