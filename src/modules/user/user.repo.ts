import UserModel, { IUser } from "./user.model";


export const userRepo = {
    findById: async (userId: string) : Promise<IUser | null> => {
        const user = await UserModel.findById(userId).lean();
        if(!user) return null

        return user
    }
}