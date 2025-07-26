import { User } from "../../domain/entities/user";
import { Request } from "express";

export interface ICustomRequest extends Request {
  user?: User;
}
