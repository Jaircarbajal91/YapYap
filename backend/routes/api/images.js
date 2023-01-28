const express = require("express");
const { Image } = require("../../db/models");
const { singlePublicFileUpload, singleMulterUpload } = require("../../awsS3");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

// Get all images
router.get("/", async (req, res) => {
	const images = await Image.findAll();
	return res.json({ images });
});

// Create an image
router.post("/", singleMulterUpload, requireAuth, async (req, res) => {
	console.log("hellloooooooooo");
	const profileImageUrl = await singlePublicFileUpload(req.file);
	const image = await Image.create({ url: profileImageUrl });
	return res.json(image);
});

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
