const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { Image } = require("../../db/models");
// const { singlePublicFileUpload, singleMulterUpload } = require("../../awsS3")
const { uploadFile } = require("../../awsS3")
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all images
router.get("/", async (req, res) => {
  const images = await Image.findAll();
  return res.json({ images });
})

// Create an image
router.post("/", upload.single('image'), async (req, res) => {
  const { file } = req
  const { type } = req.body
  const result = await uploadFile(file)
  const url = result.Location
  const image = await Image.create({ url, type });
  return res.json(image)
  // res.send(file)
  // const profileImageUrl = await singlePublicFileUpload(req.file);
  // const image = await Image.create({ url: profileImageUrl });
  // return res.json(image);
})

// // Delete an image
// router.delete("/:image_id", requireAuth, async (req, res) => {
//   const { image_id } = req.params;
//   const image = await Image.findByPk(image_id);
//   await image.destroy();
//   return res.json({
//     message: `successfully deleted ${image.dataValues.image_url}`,
//   });
// })

module.exports = router;
