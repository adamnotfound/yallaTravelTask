const multer = require("multer");
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const filePath = path.join(__dirname, "../../public/static/");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error(
      "Invalid mime type: allowed files are (png, jpg, jpeg)"
    );
    if (isValid) {
      error = null;
    }
    cb(error, filePath);
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, file.originalname + "." + ext);
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

module.exports = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
}).fields([{ name: "profileImage", maxCount: 1 }]);
