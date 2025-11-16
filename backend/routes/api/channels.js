const express = require("express");
const { Channel, Message, User, Image } = require("../../db/models");
const { body, validationResult } = require('express-validator')
const router = express.Router();

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();

// Get all messages for a channel with user info attached
router.get("/:channelId", async (req, res) => {
	const { channelId } = req.params;
	let messages = await Message.findAll({
		include: [{ 
			model: User,
			include: [{ model: Image }]
		}],
		where: { channelId },
	});
	messages = await Promise.all(
		messages.map(async (message) => {
			const messageJson = message.toJSON();
			let image = null;
			if (messageJson.imageId) {
				const imageRecord = await Image.findByPk(messageJson.imageId);
				image = imageRecord ? imageRecord.url : null;
			}
			return { ...messageJson, image };
		})
	);
	return res.json(messages);
});

// Create a channel
router.post("/",
	checkAuth,
	body('channel_name').isLength({min: 3, max: 100}),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: ['Channel name must be between 3 and 100 characters'] })
		}
		const { serverId, channel_name } = req.body;
		const channel = await Channel.create({ serverId, channel_name });
		return res.json(channel);
});

// Delete a channel
router.delete("/:channelId", checkAuth, async (req, res) => {
	const { channelId } = req.params;
	const channel = await Channel.findByPk(channelId);
	await channel.destroy();
	return res.json({
		message: `successfully deleted ${channel.dataValues.channel_name}`,
	});
});

// Update a channel
router.put("/:channelId", checkAuth, async (req, res) => {
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
