const express = require("express");
const { Channel, Message, User } = require("../../db/models");
const router = express.Router();

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();

// Get all messages for a channel with user info attached
router.get("/:channelId", async (req, res) => {
	const { channelId } = req.params;
	const messages = await Message.findAll({
		include: [{ model: User }],
		where: { channelId },
	});
	return res.json(messages);
});

// Create a channel
router.post("/create", checkAuth, async (req, res) => {
	const { serverId, channel_name } = req.body;
	const channel = await Channel.create({ serverId, channel_name });
	return res.json(channel);
});

// Delete a channel
router.delete("/delete/:channelId", checkAuth, async (req, res) => {
	const { channelId } = req.params;
	const channel = await Channel.findByPk(channelId);
	await channel.destroy();
	return res.json({
		message: `successfully deleted ${channel.dataValues.channel_name}`,
	});
});

// Update a channel
router.put("/update/:channelId", checkAuth, async (req, res) => {
	const { channelId } = req.params;
	const { channel_name } = req.body;
	const channel = await Channel.findByPk(channelId);
	try {
		channel_name && (channel.channel_name = channel_name);
		await channel.save();
	} catch (e) {
		return res.status(400).json({ message: "Invalid channel name" });
	}
	return res.json(channel);
});

module.exports = router;
