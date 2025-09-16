// utils/calcDiscountedPrice.ts
import { ICourseDiscount } from "../modules/discount/discount.model";

export function calcDiscountedPrice(
  originalPrice: number,
  discount?: ICourseDiscount
): number {

  if (!discount) return originalPrice;

  const now = new Date();
  if (!discount.isActive) return originalPrice;
  if (discount.startAt && discount.startAt > now) return originalPrice;
  if (discount.endAt && discount.endAt < now) return originalPrice;

  if (discount.type === "percent") {
    return Math.max(0, Math.floor(originalPrice * (1 - discount.value / 100)));
  } else {
    return Math.max(0, originalPrice - discount.value);
  }
}
