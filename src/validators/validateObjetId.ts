import { isValidObjectId } from "mongoose"
import { AppError } from "../utils/appError"


export const validateObjectId = (id : string , type : string): void => {
    if (!isValidObjectId(id)) {
        console.log(!isValidObjectId(id));
      throw new AppError(`${type} Id is not valid`, 422);
    }
}