import { isValidObjectId } from "mongoose"
import { AppError } from "../utils/appError"


export const validateObjectId = (id : string , type : string): true => {
    if(isValidObjectId(id)){
        return true
    } else{
        throw new AppError(`${type} Id is not valid` , 422)
    }
}