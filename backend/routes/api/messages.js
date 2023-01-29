const express = require("express");
const { Server, ChatMember, Channel } = require("../../db/models");

const router = express.Router();

const io = require("socket.io")(8001, {
	cors: {
		origin: ["http://localhost:3000"],
	},
});

io.on("connection", socket => {
	console.log("connected");
	socket.on("send-message", (message, senderId, channel_id) => {
		console.log("message sent");
		console.log(message);
		console.log(senderId);
		console.log(channel_id);
		io.emit("messageReceived", message, senderId, channel_id);
	});
});

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();

// Add a message to the database
router.post("/", checkAuth, async (req, res) => {
	console.log(req.body);
	const { message, senderId } = req.body;
	return res.json({ message, senderId });
});

module.exports = router;
