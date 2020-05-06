const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

const fileCheck = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return callback(new Error('FILE_EXTENSION_NOT_ALLOWED'));
  }

  return callback(null, true);
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const S3Storage = {
  storage: multerS3({
    s3,
    acl: 'public-read',
    bucket: process.env.AWS_S3_BUCKETNAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniquePrefix = `${Date.now()}-${Math.round(
        Math.random() * 1e9,
      )}`;
      const fileExtension = path.extname(file.originalname);
      cb(null, uniquePrefix + fileExtension);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5mb
  fileFilter: fileCheck,
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, uniquePrefix + fileExtension);
  },
});

const DiskStorage = {
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 mb
  fileFilter: fileCheck,
};

const BunnyCDN = {
  storage: StorageBunnyCDN,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileCheck,
};

const Uploader = multer(
  process.env.UPLOAD_STORAGE === 'diskstorage' ? DiskStorage : S3Storage,
).single('file');

const fileUpload = async (req, res, next) => {
  const upload = await promisify(Uploader)(req, res);

  if (upload.err) {
    if (err instanceof multer.MulterError) {
      console.error(err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.json({
          error: 422,
          data: {
            message: 'The file is too large',
          },
        });
      }
    } else if (err) {
      console.error(err);
      if (err.message === 'FILE_EXTENSION_NOT_ALLOWED') {
        return res.json({
          error: 422,
          message: 'File extension not supported',
        });
      }

      return res.json({
        error: 503,
        data: {
          message: 'Internal Error',
        },
      });
    }
  }

  next();
};

module.exports = { fileCheck, fileUpload };
