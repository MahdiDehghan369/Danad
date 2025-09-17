import { ObjectId, Types } from "mongoose";
import { cartRepo } from "./cart.repo";
import { courseRepo } from "../course/course.repo";
import { AppError } from "../../utils/appError";
import CourseDiscountModel from "../discount/discount.model";
import { calcDiscountedPrice } from "../../utils/calcDiscountedPrice";
import { couponRepo } from "../coupen/coupon.repo";
import { isValidCoupon } from "../../utils/validationCoupon";
import { couponUsageRepo, IQueryGetCoupons } from "../couponUsage/couponUsage.repo";
import { walletRepo } from "../wallet/wallet.repo";
import { transactionRepo } from "../transaction/transaction.repo";
import { generateRefId } from "../../utils/generateRefId";
import { purchasedCourseRepo } from "../purchasedCourse/purchasedCourse.repo";

export const getCartService = async (user: string) => {
  const cart = await cartRepo.findOrCreate(user);
  return cart;
};

export const addItemToCartService = async (
  userId: string,
  courseId: string
) => {
  const cart = await cartRepo.findOrCreate(userId);

  const course = await courseRepo.findOne({ _id: courseId });

  if (!course) throw new AppError("Course not found", 404);

  const existingItem = cart.items.find(
    (item: any) => item.course._id.toString() === courseId
  );

  if (existingItem) throw new AppError("Course already in cart", 409);

  const discounts = await CourseDiscountModel.find({ isActive: true }).lean();
  const now = new Date();

  const globalDiscount = discounts.find(
    (d) =>
      d.scope === "all" &&
      (!d.startAt || d.startAt <= now) &&
      (!d.endAt || d.endAt >= now)
  );

  const courseDiscount = discounts.find(
    (discount) =>
      discount.scope === "single" &&
      String(discount.course) === String(courseId) &&
      (!discount.startAt || discount.startAt <= now) &&
      (!discount.endAt || discount.endAt >= now)
  );

  const applied = courseDiscount || globalDiscount;
  const discountedPrice = calcDiscountedPrice(course.price, applied);

  cart.items.push({
    course: course._id,
    price: discountedPrice,
  });

  const subtotal =
    cart.subtotal + (course.price === undefined ? 0 : course.price);
  const discountAmount =
    cart.discountAmount +
    (course.price === undefined ? 0 : course.price - discountedPrice);

  const finalTotal = cart.finalTotal + discountedPrice;

  cart.subtotal = subtotal;
  cart.discountAmount = discountAmount;
  cart.finalTotal = finalTotal;

  await cart.save();

  return { cart };
};

export const removeItemService = async (userId: string, itemId: string) => {
  const cart = await cartRepo.findOrCreate(userId);

  const itemIndex = cart.items.findIndex(
    (item: any) => item._id.toString() === itemId
  );

  if (itemIndex === -1) throw new AppError("Item not found in cart", 404);

  const course = await courseRepo.findOne({
    _id: cart.items[itemIndex].course,
  });

  if (!course) throw new AppError("Course not found", 404);

  cart.items.splice(itemIndex, 1);

  const discounts = await CourseDiscountModel.find({ isActive: true }).lean();
  const now = new Date();

  let subtotal = 0;
  let discountAmount = 0;
  let finalTotal = 0;

  cart.items = await Promise.all(
    cart.items.map(async (item: any) => {
      const courseItem = await courseRepo.findOne({ _id: item.course });
      if (!courseItem) throw new AppError("Course not found", 404);

      const courseDiscount = discounts.find(
        (discount) =>
          discount.scope === "single" &&
          String(discount.course) === String(courseItem._id) &&
          (!discount.startAt || discount.startAt <= now) &&
          (!discount.endAt || discount.endAt >= now)
      );

      const globalDiscount = discounts.find(
        (discount) =>
          discount.scope === "all" &&
          (!discount.startAt || discount.startAt <= now) &&
          (!discount.endAt || discount.endAt >= now)
      );

      const applied = courseDiscount || globalDiscount;
      const discountedPrice = calcDiscountedPrice(courseItem.price, applied);

      subtotal += courseItem.price;
      discountAmount += courseItem.price - discountedPrice;
      finalTotal += subtotal - discountAmount;

      return { ...item, price: courseItem.price, discountedPrice };
    })
  );

  if (cart.coupon) {
    const coupon = await couponRepo.findOne({ _id: cart.coupon });
    if (coupon) {
      if (coupon.type === "percent") {
        discountAmount += (finalTotal * coupon.value) / 100;
      } else if (coupon.type === "fixed") {
        discountAmount += coupon.value;
      }
      if (discountAmount > subtotal) discountAmount = subtotal;
    }
  }

  cart.subtotal = subtotal;
  cart.discountAmount = discountAmount;
  cart.finalTotal = subtotal - discountAmount;

  await cart.save();

  return { cart };
};

export const removeCouponCartService = async (userId: string) => {
  const cart = await cartRepo.findOrCreate(userId);

  if (!cart.coupon) throw new AppError("No coupon applied on cart", 400);

  const coupon = await couponRepo.findOne({ _id: cart.coupon });
  if (!coupon) throw new AppError("Coupon not found", 404);

  cart.coupon = undefined;

  const discounts = await CourseDiscountModel.find({ isActive: true }).lean();
  const now = new Date();

  let subtotal = 0;
  let discountAmount = 0;

  for (const item of cart.items) {
    const course = await courseRepo.findOne({ _id: item.course });
    if (!course) continue;

    const globalDiscount = discounts.find(
      (d) =>
        d.scope === "all" &&
        (!d.startAt || d.startAt <= now) &&
        (!d.endAt || d.endAt >= now)
    );

    const courseDiscount = discounts.find(
      (d) =>
        d.scope === "single" &&
        String(d.course) === String(course._id) &&
        (!d.startAt || d.startAt <= now) &&
        (!d.endAt || d.endAt >= now)
    );

    const applied = courseDiscount || globalDiscount;
    const discountedPrice = calcDiscountedPrice(course.price, applied);

    subtotal += course.price;
    discountAmount += course.price - discountedPrice;
  }

  const finalTotal = subtotal - discountAmount;

  cart.subtotal = subtotal;
  cart.discountAmount = discountAmount;
  cart.finalTotal = finalTotal;

  await cart.save();

  return { cart };
};

export const applyCouponService = async (userId: string, code: string) => {
  const cart = await cartRepo.findOrCreate(userId);

  code = code.trim();
  code = code.toUpperCase();

  const coupon = await couponRepo.findOne({ code });

  if (!coupon) throw new AppError("Coupon not found", 404);

  const isValid = isValidCoupon(coupon);

  if (!isValid) throw new AppError("Coupon is not valid", 400);

  const usedIt = await couponUsageRepo.findOne({
    user: userId,
    coupon: coupon._id,
  });

  if (usedIt) throw new AppError("You used it", 400);

  let finalTotal = cart.finalTotal;
  let subtotal = cart.subtotal;
  let discountAmount = cart.discountAmount;

  if (coupon.type === "percent") {
    discountAmount += (finalTotal * coupon.value) / 100;
  } else if (coupon.type === "fixed") {
    discountAmount += coupon.value;
  }

  cart.coupon = coupon._id;
  cart.discountAmount = discountAmount;
  cart.finalTotal = subtotal - discountAmount;

  await cart.save();

  if (coupon.usageLimit) {
    await couponRepo.findOneAndUpdate({ code }, { $inc: { usedCount: 1 } });
  }

  await couponUsageRepo.create({ user: userId, coupon: coupon._id.toString() });

  return { cart };
};

export const checkoutService = async (userId: string) => {
  const cart = await cartRepo.findOrCreate(userId);

  if (cart.items.length === 0)
    throw new AppError("Cart is empty , No item exists", 422);

  const wallet = await walletRepo.findOne({ user: userId });

  if (!wallet || wallet.balance < cart.finalTotal) throw new AppError("Insufficient balance", 400);

  const newTransaction = await transactionRepo.create({
    user: userId,
    wallet: wallet._id.toString(),
    type: "purchase",
    amount: cart.finalTotal,
    description: "Purchase course",
    gateway: "manual",
    refId: generateRefId(),
  });

  const updatedWallet = await walletRepo.findOneAndupdate(
    { user: userId },
    { $inc: { balance: -cart.finalTotal } }
  );

  for (const item of cart.items) {
    const course = await courseRepo.findOne({ _id: item.course });
    if (!course) continue;

    const discounts = await CourseDiscountModel.find({ isActive: true }).lean();
    const now = new Date();

    const globalDiscount = discounts.find(
      (d) =>
        d.scope === "all" &&
        (!d.startAt || d.startAt <= now) &&
        (!d.endAt || d.endAt >= now)
    );

    const courseDiscount = discounts.find(
      (d) =>
        d.scope === "single" &&
        String(d.course) === String(course._id) &&
        (!d.startAt || d.startAt <= now) &&
        (!d.endAt || d.endAt >= now)
    );

    const applied = courseDiscount || globalDiscount;
    const discountedPrice = calcDiscountedPrice(course.price, applied);

    await purchasedCourseRepo.create({
      user: userId,
      course: course._id.toString(),
      basePrice: course.price,
      priceAtPurchase: discountedPrice,
      discountAmount: course.price - discountedPrice,
      coupon: cart.coupon?.toString() ?? null,
      payment: {
        gateway: "manual",
        transactionId: newTransaction.refId,
      },
    });
  }

  cart.items = [];
  cart.subtotal = 0;
  cart.discountAmount = 0;
  cart.finalTotal = 0;
  cart.coupon = undefined;

  await cart.save();

  return { transaction: newTransaction, wallet: updatedWallet };
};

export const getCouponUsageService = async (userId: string , query: IQueryGetCoupons) => {
  
  const coupons = await couponUsageRepo.find(userId , query)

  return coupons

}