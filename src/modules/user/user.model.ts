import mongoose , {Document , Schema , model} from "mongoose"
import bcrypt from "bcrypt"

export type UserRole = "student" | "teacher" | "admin"

interface IUser extends Document {
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  role: UserRole;
  isBlocked: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 8 },
    avatar: { type: String },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);


userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password , this.password)
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const userModel = model<IUser>("User" , userSchema)

export default userModel