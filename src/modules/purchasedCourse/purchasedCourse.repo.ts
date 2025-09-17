import purchasedCourseModel, { IPurchasedCourse } from "./purchasedCourse.model";

export interface ICreatePurchasedCourse {
      user: string;
      course: string;
      basePrice: number; 
      priceAtPurchase: number;
      discountAmount: number; 
      coupon?: string | null;
      payment: {
        gateway?: string;
        transactionId?: string;
      };
}

export const purchasedCourseRepo = {
    create: async (data: ICreatePurchasedCourse) : Promise<IPurchasedCourse> => await purchasedCourseModel.create(data)
}