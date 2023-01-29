const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { Image } = require("../../db/models");
<<<<<<< HEAD
// const { singlePublicFileUpload, singleMulterUpload } = require("../../awsS3")
const { uploadFile } = require("../../awsS3")
=======
const { singlePublicFileUpload, singleMulterUpload } = require("../../awsS3");
>>>>>>> d4ca0e5f9dc5ef0b8435b229b32503a67c0f1832
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all images
router.get("/", async (req, res) => {
	const images = await Image.findAll();
	return res.json({ images });
});

// Create an image
<<<<<<< HEAD
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
=======
router.post("/", singleMulterUpload, requireAuth, async (req, res) => {
	console.log("hellloooooooooo");
	const profileImageUrl = await singlePublicFileUpload(req.file);
	const image = await Image.create({ url: profileImageUrl });
	return res.json(image);
});
>>>>>>> d4ca0e5f9dc5ef0b8435b229b32503a67c0f1832

// // Delete an image
// router.delete("/:imageId", requireAuth, async (req, res) => {
//   const { imageId } = req.params;
//   const image = await Image.findByPk(imageId);
//   await image.destroy();
//   return res.json({
//     message: `successfully deleted ${image.dataValues.image_url}`,
//   });
// })

module.exports = router;
