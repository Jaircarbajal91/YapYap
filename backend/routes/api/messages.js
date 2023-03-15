const express = require("express");
const {
  Server,
  ChatMember,
  Channel,
  Message,
  User,
  Image,
} = require("../../db/models");

const router = express.Router();

const checkAuth = (req, res, next) =>
  !req.user
    ? next(new Error("Please log in or register to access this information."))
    : next();

// Add a message to the database
router.post("/", checkAuth, async (req, res) => {
  const { message, senderId, channelId, dmId, imageId } = req.body;
  // commit this message to the database
  const newMessage = await Message.create({
    message,
    senderId,
    channelId,
    dmId,
    imageId,
  });
  return res.json(newMessage);
});

// get all messages for a dm
router.get("/dm/:dmId", async (req, res) => {
  const { dmId } = req.params;
  let messages = await Message.findAll({
    where: { dmId },
  });
	messages = await Promise.all(
		messages.map(async (message) => {
			const sender = await User.findByPk(message.senderId);
			const image = await Image.findByPk(message.imageId);
			return { ...message.dataValues, User: sender, image };
		})
	);
  return res.json({ messages });
});

module.exports = router;
