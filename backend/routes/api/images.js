const express = require("express");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })
const { Image } = require("../../db/models");
const { uploadFile, deleteFile } = require("../../awsS3")
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all images
router.get("/", async (req, res) => {
	const images = await Image.findAll();
	return res.json({ images });
});

// Create an image
router.post("/", upload.single('image'), async (req, res) => {
  // write some safety checks here
  const { file } = req
  console.log(file)
  const { type } = req.body
  const result = await uploadFile(file)
  const url = result.Location
  const image = await Image.create({ url, type });
  return res.json(image)
})

// Delete an image
router.delete("/:id", requireAuth, async (req, res) => {
  const image = await Image.findByPk(req.params.id);
  if (image) {
    // Delete image from AWS S3
    await deleteFile(image.url);
    await image.destroy();
    return res.json({ message: "Image deleted" });
  } else {
    return res.json({ message: "Image not found" });
  }
});


module.exports = router;
