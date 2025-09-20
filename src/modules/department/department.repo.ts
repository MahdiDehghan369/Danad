import { DeleteResult } from "mongoose";
import departmentModel, { IDepartment } from "./department.model";

export interface ICreateDepartment {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
}

export interface IEditDepartment {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface IQuery {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const departmentRepo = {
  create: async (data: ICreateDepartment): Promise<IDepartment> =>
    await departmentModel.create(data),
  findOne: async (condition: object): Promise<IDepartment | null> =>
    await departmentModel.findOne(condition),
  findOneAndUpdate: async (
    condition: object,
    data: Partial<IEditDepartment>
  ): Promise<IDepartment | null> =>
    await departmentModel.findOneAndUpdate(condition, data, { new: true }),
  deleteOne: async (condition: object): Promise<DeleteResult> =>
    await departmentModel.deleteOne(condition),
  find: async (query?: IQuery) => {
    let filterObj: IQuery = {};

    if (query?.isActive !== undefined) {
      filterObj.isActive = query.isActive;
    }

  const limit = query?.limit && query.limit > 0 ? query.limit : 10;
  const page = query?.page && query.page > 0 ? query.page : 1;

    const departments = await departmentModel
      .find(filterObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await departmentModel.countDocuments(filterObj);

    return { departments, total , page , limit };
  },
  findAll: async () : Promise<IDepartment[] | []> => await departmentModel.find({isActive: true}).select("name _id slug").lean()
};
