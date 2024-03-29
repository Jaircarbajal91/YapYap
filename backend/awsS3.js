require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.S3_BUCKET
const region = process.env.S3_REGION
const accessKeyId = process.env.S3_KEY
const secretAccessKey = process.env.S3_SECRET

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

const uploadFile = (file) => {
  console.log(file)
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}

const downloadFile = (key) => {
  const downloadParams = {
    Key: key,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}



module.exports = { downloadFile, uploadFile }
































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
