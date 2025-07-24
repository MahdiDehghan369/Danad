import mongoose , {Schema , Document , model} from "mongoose"

interface IRefreshToken extends Document {
  _id: mongoose.Types.ObjectId;
  token: string;
  user: mongoose.Types.ObjectId;
  ip: string;
  userAgent: string;
  expireIn: Date;
}


const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    ip: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export const refreshTokenModel = model<IRefreshToken>("refresh-token" , refreshTokenSchema)