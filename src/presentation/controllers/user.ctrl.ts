import { NextFunction, Request, Response } from "express";
import { userRepository } from "../../infrastructure/db/mongodb/repositories/userRepository";
import { updateUser } from "../../application/usecases/user/updateUser";
import { ICustomRequest } from "../../application/interfaces/ICustomReq";
import { removeUserByAdmin } from "../../application/usecases/user/removeUser";
import { getUserInformation } from "../../application/usecases/user/getUserInfo";
import { getAllUsers } from "../../application/usecases/user/getAllUsers";
import { BanRepository } from "../../infrastructure/db/mongodb/repositories/banReposiroey";
import { banUserUseCase } from "../../application/usecases/user/banUser";
import { unbanUserUseCase } from "../../application/usecases/user/unbanUser";
import { getAllBannedUsers } from "../../application/usecases/user/getAllBannedUsers";
import { uploadUserProfile } from "../../application/usecases/user/uploadUserProfile";
import { removeUserProfile } from "../../application/usecases/user/removeUserProfile";
import { AppError } from "../../utils/appError";

interface GetUserOptions {
  isBlocked?: string;
  page?: number;
  limit?: number;
}

export const updateUserInfo = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req?.user?._id as string;

    const userRepo = new userRepository();
    const updatedUserUseCase = new updateUser(userRepo);

    const data = await updatedUserUseCase.execute(userId, req?.body);

    return res.status(201).json({
      success: true,
      message: "Updated successfully",
      data: {
        user: data.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req?.params;

    const userRepo = new userRepository();
    const removeUserUseCase = new removeUserByAdmin(userRepo);

    const data = await removeUserUseCase.execute(userId);

    return res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req?.params;

    const userRepo = new userRepository();
    const getUserInfoUseCase = new getUserInformation(userRepo);

    const data = await getUserInfoUseCase.exeute(userId);

    return res.status(200).json({
      success: true,
      data: {
        user: data.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepo = new userRepository();
    const getAllUsersUseCase = new getAllUsers(userRepo);

    const option: GetUserOptions = req.query;

    const data = await getAllUsersUseCase.execute(option);

    return res.status(200).json({
      success: true,
      data: {
        users: data.data,
        limit: data.limit,
        page: data.page,
        total: data.total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepo = new userRepository();
    const banRepo = new BanRepository();

    const banUserService = new banUserUseCase(banRepo, userRepo);

    const banData = {
      user: req.body.user,
      bannedBy: req.user?._id!,
      reason: req.body.reason,
      expiresAt: req.body.expiresAt,
    };

    const data = await banUserService.execute(banData);

    return res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: {
        ban: data.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (req: Request , res: Response , next: NextFunction) => {
    try {
        const userId = req.body.user
        const userRepo = new userRepository();
        const banRepo = new BanRepository();
        const unbanUserService = new unbanUserUseCase(banRepo, userRepo);

        const data = await unbanUserService.execute(userId);

        return res.status(201).json({
            success: true,
            message: "User unbanned successfully"
        })
        
    } catch (error) {
        next(error)
    }
}

export const fetchBannedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const banRepo = new BanRepository();
    const userRepo = new userRepository();
    const getAllBannedUsersService = new getAllBannedUsers(banRepo ,userRepo);

    const data = await getAllBannedUsersService.execute(req.query)

    return res.status(200).json({
        success: true,
        data: {
            bannedUsers: data.bannedUsersData
        }
    })
  } catch (error) {
    next(error);
  }
};


export const uploadProfile = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {
    const userId = req.user?._id as string
    const file = req.file

    if(!file) throw new AppError("No file uploaded" , 400)

    const userRepo = new userRepository()

    const uploadProfileUseCase = new uploadUserProfile(userRepo)

    const data = await uploadProfileUseCase.execute(userId , file)

    return res.status(200).json({
      success: true,
      message: "Profile set successfully",
      data: {
        avatar: data.avatarPath
      }
    })
    
  } catch (error) {
    next(error)
  }  
}

export const removeProfile = async (req: ICustomRequest , res: Response , next: NextFunction) => {
  try {

    const userId = req.user?._id

    const userRepo = new userRepository()
    const removeProfileUseCase = new removeUserProfile(userRepo)

    const data = await removeProfileUseCase.execute(userId as string)

    return res.status(200).json({
      success: true,
      message: "Profile removed successfully"
    })
    
  } catch (error) {
    next(error)
  }
}