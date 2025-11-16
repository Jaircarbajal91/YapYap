require("dotenv").config();
const fs = require("fs");
const path = require("path");
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_KEY;
const secretAccessKey = process.env.S3_SECRET;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const ensureConfigured = () => {
  if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing AWS S3 configuration. Please set S3_BUCKET, S3_REGION, S3_KEY, and S3_SECRET environment variables."
    );
  }
};

const getObjectKey = (keyOrUrl) => {
  if (!keyOrUrl || typeof keyOrUrl !== "string") return null;

  if (/^https?:\/\//i.test(keyOrUrl)) {
    try {
      const parsed = new URL(keyOrUrl);
      return decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    } catch (error) {
      console.warn("Failed to parse S3 object URL.", error);
      return null;
    }
  }

  return keyOrUrl;
};

const uploadFile = async (file) => {
  ensureConfigured();

  if (!file || !file.path || !file.filename) {
    throw new Error("Invalid file upload: missing multer file data.");
  }

  const fileStream = fs.createReadStream(file.path);
  const extension = file.originalname ? path.extname(file.originalname) : "";
  const key = `${file.filename}${extension}`;

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: key,
    ACL: "public-read",
    ContentType: file.mimetype,
  };

  const uploadResult = await s3.upload(uploadParams).promise();

  fs.unlink(file.path, (err) => {
    if (err) {
      console.warn("Unable to remove temporary upload after S3 transfer.", err);
    }
  });

  return uploadResult;
};

const downloadFile = (keyOrUrl) => {
  ensureConfigured();
  const Key = getObjectKey(keyOrUrl);

  if (!Key) {
    throw new Error("Missing file key for S3 download.");
  }

  const downloadParams = {
    Key,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};

const deleteFile = async (keyOrUrl) => {
  ensureConfigured();
  const Key = getObjectKey(keyOrUrl);

  if (!Key) {
    throw new Error("Missing file key for S3 delete operation.");
  }

  const deleteParams = {
    Bucket: bucketName,
    Key,
  };

  return s3.deleteObject(deleteParams).promise();
};

module.exports = { downloadFile, uploadFile, deleteFile };
































// const AWS = require("aws-sdk");
// // name of your bucket here
// const NAME_OF_BUCKET = process.env.S3_BUCKET;

// const multer = require("multer");

// //  make sure to set environment variables in production for:
// //  AWS_ACCESS_KEY_ID
// //  AWS_SECRET_ACCESS_KEY
// //  and aws will automatically use those environment variables

// const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// // --------------------------- Public UPLOAD ------------------------

// const singlePublicFileUpload = async (file) => {
//   const { originalname, mimetype, buffer } = await file;
//   const path = require("path");
//   // name of the file in your S3 bucket will be the date in ms plus the extension name
//   const Key = new Date().getTime().toString() + path.extname(originalname);
//   const uploadParams = {
//     Bucket: NAME_OF_BUCKET,
//     Key,
//     Body: buffer,
//     ACL: "public-read",
//   };
//   const result = await s3.upload(uploadParams).promise();

//   // save the name of the file in your bucket as the key in your database to retrieve for later
//   return result.Location;
// };

// const multiplePublicFileUpload = async (files) => {
//   return await Promise.all(
//     files.map((file) => {
//       return singlePublicFileUpload(file);
//     })
//   );
// };

// // --------------------------- Prviate UPLOAD ------------------------

// const singlePrivateFileUpload = async (file) => {
//   const { originalname, mimetype, buffer } = await file;
//   const path = require("path");
//   // name of the file in your S3 bucket will be the date in ms plus the extension name
//   const Key = new Date().getTime().toString() + path.extname(originalname);
//   const uploadParams = {
//     Bucket: NAME_OF_BUCKET,
//     Key,
//     Body: buffer,
//   };
//   const result = await s3.upload(uploadParams).promise();

//   // save the name of the file in your bucket as the key in your database to retrieve for later
//   return result.Key;
// };

// const multiplePrivateFileUpload = async (files) => {
//   return await Promise.all(
//     files.map((file) => {
//       return singlePrivateFileUpload(file);
//     })
//   );
// };

// const retrievePrivateFile = (key) => {
//   let fileUrl;
//   if (key) {
//     fileUrl = s3.getSignedUrl("getObject", {
//       Bucket: NAME_OF_BUCKET,
//       Key: key,
//     });
//   }
//   return fileUrl || key;
// };

// // --------------------------- Storage ------------------------

// const storage = multer.memoryStorage({
//   destination: function (req, file, callback) {
//     callback(null, "");
//   },
// });

// const singleMulterUpload = (nameOfKey) =>
//   multer({ storage: storage }).single(nameOfKey);
// const multipleMulterUpload = (nameOfKey) =>
//   multer({ storage: storage }).array(nameOfKey);

// module.exports = {
//   s3,
//   singlePublicFileUpload,
//   multiplePublicFileUpload,
//   singlePrivateFileUpload,
//   multiplePrivateFileUpload,
//   retrievePrivateFile,
//   singleMulterUpload,
//   multipleMulterUpload,
// };
