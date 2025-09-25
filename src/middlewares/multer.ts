import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/appError";
import { Request as ExpressRequest } from "express";

const pathPublicFolder = path.join(__dirname, "..", "..", "public");

if (!fs.existsSync(pathPublicFolder)) {
  fs.mkdirSync(pathPublicFolder);
}

const destinationProfile = path.join(pathPublicFolder, "profile");
const destinationCourseCover = path.join(pathPublicFolder, "course-cover");
const destinationCourseSessionVideo = path.join(
  pathPublicFolder,
  "session-video"
);
const destinationCourseSessionFile = path.join(
  pathPublicFolder,
  "session-file"
);

const destinationArticleCover = path.join(pathPublicFolder, "article-cover");

if (!fs.existsSync(destinationProfile)) {
  fs.mkdirSync(destinationProfile);
}

if (!fs.existsSync(destinationArticleCover)) {
  fs.mkdirSync(destinationArticleCover);
}

if (!fs.existsSync(destinationCourseCover)) {
  fs.mkdirSync(destinationCourseCover);
}

if (!fs.existsSync(destinationCourseSessionFile)) {
  fs.mkdirSync(destinationCourseSessionFile);
}

if (!fs.existsSync(destinationCourseSessionVideo)) {
  fs.mkdirSync(destinationCourseSessionVideo);
}

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profile") cb(null, destinationProfile);
    else if (file.fieldname === "cover") cb(null, destinationCourseCover);
    else if (file.fieldname === "session-file")
      cb(null, destinationCourseSessionFile);
    else if (file.fieldname === "session-video")
      cb(null, destinationCourseSessionVideo);
    else if (file.fieldname === "article-cover")
      cb(null, destinationArticleCover);
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
    cb(new AppError("Invalid file type.", 422));
  }
};

const multerVideoFilter = (
  req: ExpressRequest<any, any, any>,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ["video/mp4", "video/mov"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Invalid file type. Only video files are allowed.", 422));
  }
};

const multerArchiveFilter = (
  req: ExpressRequest<any, any, any>,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimes = ["application/zip", "application/x-rar-compressed"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only ZIP and RAR files are allowed.",
        422
      )
    );
  }
};

export const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter as any,
  limits: { fileSize: 2 * 1024 * 1024 },
});


// export const uploadSessionVideo = multer({
//   storage: multerStorage,
//   fileFilter: multerVideoFilter as any,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// export const uploadSessionFile = multer({
//   storage: multerStorage,
//   fileFilter: multerArchiveFilter as any,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

export const uploadFile = multer({
  storage: multerStorage,
  fileFilter: (
    req: ExpressRequest,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.fieldname === "session-video") {
      multerVideoFilter(req, file, cb);
    } else if (file.fieldname === "session-file") {
      multerArchiveFilter(req, file, cb);
    } else {
      cb(new AppError("Unexpected field", 422));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});
