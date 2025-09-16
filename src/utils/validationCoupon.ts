import { ICoupon } from "../modules/coupen/coupon.model";

export function isValidCoupon(coupon: ICoupon): boolean {
  const now = new Date();
  if (!coupon.isActive) return false;
  if (coupon.startAt && coupon.startAt > now) return false;
  if (coupon.endAt && coupon.endAt < now) return false;
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false;
  return true;
}
