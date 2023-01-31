const express = require("express");
const { Server, ChatMember, Channel, Message } = require("../../db/models");

const router = express.Router();

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();

// Add a message to the database
router.post("/", checkAuth, async (req, res) => {
	// console.log(req.body);
	const { message, senderId, channelId, dmId, imageId } = req.body;
	// commit this message to the database
	const newMessage = await Message.create({
		message,
		senderId,
		channelId,
		dmId,
		imageId,
	});
	// console.log(newMessage)
	return res.json(newMessage);
});

module.exports = router;
