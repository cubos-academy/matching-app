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
    },
});

const Uploader = multer({
    storage,
    limits: { fileSize: 5*1024*1024 },
}).single('file');

const fileUpload = (req, res, next) => {
    Uploader(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error(err);
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.json({
                    error: 422,
                    data: {
                        message: "The file is too large."
                    },
                });
            }
        } else if (err) {
        console.error(err);
        return res.json({
            error: 503,
            data: {
                message: "Internal Error",
            },
        });
        }

        next();
    });
};

module.exports = { fileCheck, fileUpload };