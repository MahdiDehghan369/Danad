import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/appError";

const pathPublicFolder = path.join(__dirname, "..", "..", "public");

if (!fs.existsSync(pathPublicFolder)) {
  fs.mkdirSync(pathPublicFolder);
}

const destinationProfile = path.join(pathPublicFolder, "profile");
const destinationCourseCover = path.join(pathPublicFolder, "course-cover");

if (!fs.existsSync(destinationProfile)) {
  fs.mkdirSync(destinationProfile);
}

if (!fs.existsSync(destinationCourseCover)) {
  fs.mkdirSync(destinationCourseCover);
}

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname === "profile")
      cb(null, destinationProfile);
    else
      cb(null, destinationCourseCover);
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
