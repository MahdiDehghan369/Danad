import {Document, Types , Schema , model} from "mongoose"

interface IRefreshToken {
  token: string;
  user: Types.ObjectId;
  ip: string;
  userAgent: string;
  expireIn: Date;
  isValid: boolean
}

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String,
      required: true,
      ref: "User"
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


const refreshTokenModel = model<IRefreshToken>("RefreshToken" , refreshTokenSchema)

export default refreshTokenModel