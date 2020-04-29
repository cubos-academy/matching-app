const AWS = require("aws-sdk");
const multer  = require('multer');
const multerS3 = require('multer-s3');
const path = require("path");

const fileCheck = (req, file, next) => {
    if (file.originalName.match('/\.(jpg|jpeg|png)$/')) {
        return next(new Error('Only image files are allowed!'), false)
    }

    return next(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, uniquePrefix + fileExtension);
    }
});

const fileUpload = multer({ storage });

module.exports = { fileCheck, fileUpload };