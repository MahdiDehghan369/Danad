import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "..", "public");

    if (file.fieldname === "profile") {
      uploadPath = path.join(uploadPath, "profiles");
    } else if (file.fieldname === "courseFile") {
      uploadPath = path.join(uploadPath, "courses");
    }

    createFolderIfNotExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const extFile = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${extFile}`;
    cb(null, uniqueName);
  },
});


const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const imageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;
