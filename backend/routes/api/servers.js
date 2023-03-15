const express = require("express");
const { Server, ChatMember, Channel } = require("../../db/models");

const router = express.Router();

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();

// Get all servers for current user with channels attached
router.get("/", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const chatMembers = await ChatMember.findAll({
		include: [{ model: Server, include: [{ model: Channel }] }],
		where: { userId },
	});
	const result = [];
	chatMembers.forEach(chatMember => {
		const server = chatMember.Server;
		if (server) result.push(server);
	});
	return res.json({ Servers: result });
});

// Create a server
router.post("/create", checkAuth, async (req, res) => {
	const ownerId = req.user.id;
	const { server_name, imageId } = req.body;
	const server = await Server.create({ server_name, imageId, ownerId });
	await ChatMember.create({ userId: ownerId, serverId: server.id });
	return res.json(server);
});

// Delete a server
router.delete("/delete/:serverId", checkAuth, async (req, res) => {
	const { serverId } = req.params;
	const server = await Server.findByPk(serverId);
	await server.destroy();
	return res.json({
		message: `successfully deleted ${server.dataValues.server_name}`,
	});
});

// Update a server
router.put("/update/:serverId", checkAuth, async (req, res) => {
	const { serverId } = req.params;
	const { server_name, imageId } = req.body;
	const server = await Server.findByPk(serverId);
	try {
		server_name && (server.server_name = server_name);
		await server.save();
	} catch (e) {
		return res.status(400).json({ message: "Invalid server name" });
	}
	try {
		imageId && (server.imageId = imageId);
		await server.save();
	} catch (e) {
		return res.status(400).json({ message: "Invalid image id" });
	}
	return res.json(server);
});

// Get all channels for a server
router.get('/:serverId/channels', checkAuth, async (req, res) => {
	const { serverId } = req.params;
	const channels = await Channel.findAll({
		where: {
			serverId: serverId
		}
	})
	return res.json(channels)
})

module.exports = router;
