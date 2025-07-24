import { RegisterUser } from "../../../application/usecases/auth/registerUser";
import { userRepository } from "../../../infrastructure/db/mongodb/repositories/userRepository";
import { Request, Response, NextFunction } from "express";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepo = new userRepository();

    const existsUsername = await userRepo.findByUsername(req.body?.username);
    const existsEmail = await userRepo.findByEmail(req.body?.email);
    const existsPhone = await userRepo.findByPhone(req.body?.phone);

    if (existsUsername) {
      return res
        .status(409)
        .json({ success: false, message: "Username already exists" });
    } else if (existsEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    } else if (existsPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const registerUsercase = new RegisterUser(userRepo);

    const user = await registerUsercase.execute(req?.body);

    res.status(201).json({ message: "User registered" , data: user });
  } catch (error) {
    next(error);
  }
};
