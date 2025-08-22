import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/appError";

const pathPublicFolder = path.join(__dirname, "..", "..", "public");

if (!fs.existsSync(pathPublicFolder)) {
  fs.mkdirSync(pathPublicFolder);
}

const destination = path.join(pathPublicFolder, "profile");

if (!fs.existsSync(destination)) {
  fs.mkdirSync(destination);
}

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);

    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type." , 422));
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter as any,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default uploadPhoto;
