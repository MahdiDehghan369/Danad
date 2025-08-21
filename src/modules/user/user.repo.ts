import UserModel, { IUser } from "./user.model";


export const userRepo = {
    findById: async (userId: string) : Promise<IUser | null> => {
        const user = await UserModel.findById(userId).lean();
        if(!user) return null
        return user
    },
    updateUserById: async (userId: string , data: object) : Promise<IUser | null> => {
        const user = UserModel.findOneAndUpdate({_id: userId} , data)
        if(!user) return null

        return user
    }
}