import mongoose, {Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt"

interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  avatar: string;
  role: "USER" | "TEACHER" | "ADMIN";
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["USER", "TEACHER", "ADMIN"],
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save" , async function(next) {
if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})


userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};




export const userModel = model<IUser>("user", userSchema);
