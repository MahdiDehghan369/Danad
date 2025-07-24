import jwt from "jsonwebtoken"

interface IPyload {
    _id: string
}

export const generateAccessToken = (pyload: IPyload) => {
    return jwt.sign(pyload, process.env.SECRET_KEY as string, {
      expiresIn: "15m",
    });
}

export const generateRefreshToken = (pyload: IPyload) => {
  return jwt.sign(pyload, process.env.SECRET_KEY as string, {
    expiresIn: "15d",
  });
};


export const verifyAccessToken = (token : string) => {
    return jwt.verify(token, process.env.SECRET_KEY as string);
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.SECRET_KEY as string);
};