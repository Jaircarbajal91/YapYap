const express = require("express");
const { Server, ChatMember, Channel, Message } = require("../../db/models");

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
	const messages = await Message.findAll({
		where: { dmId },
	});
	return res.json({ messages });
});

module.exports = router;
