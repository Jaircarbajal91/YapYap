const express = require("express");
const { Server, ChatMember, Channel, User, Image } = require("../../db/models");

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

// Delete a server (only owner can delete)
router.delete("/delete/:serverId", checkAuth, async (req, res) => {
	const { serverId } = req.params;
	const userId = req.user.id;

	try {
		const server = await Server.findByPk(serverId);
		if (!server) {
			return res.status(404).json({ error: "Server not found" });
		}

		// Check if user is the owner of the server
		if (server.ownerId !== userId) {
			return res.status(403).json({ error: "Only the server owner can delete the server" });
		}

		// Get all server members to notify them before deletion
		const allMembers = await ChatMember.findAll({
			where: { serverId },
			attributes: ["userId"],
		});
		const memberIds = allMembers.map(m => m.userId);

		// Delete the server (this will cascade delete ChatMembers and Channels)
		await server.destroy();

		// Emit socket event to notify all members
		const io = req.app.get('io');
		if (io) {
			memberIds.forEach(memberId => {
				io.to(`user-${memberId}`).emit("serverDeleted", {
					serverId,
				});
			});
		}

		return res.json({
			message: `successfully deleted ${server.server_name}`,
		});
	} catch (error) {
		console.error("Error deleting server:", error);
		return res.status(500).json({ error: error.message });
	}
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

// Add a friend to a server
router.post('/:serverId/add-member', checkAuth, async (req, res) => {
	const { serverId } = req.params;
	const { friendId } = req.body;
	const userId = req.user.id;

	if (!friendId) {
		return res.status(400).json({ error: "friendId is required" });
	}

	try {
		// Check if server exists
		const server = await Server.findByPk(serverId);
		if (!server) {
			return res.status(404).json({ error: "Server not found" });
		}

		// Check if current user is a member of the server (has permission to add members)
		const currentUserMember = await ChatMember.findOne({
			where: {
				userId,
				serverId,
			},
		});

		if (!currentUserMember) {
			return res.status(403).json({ error: "You must be a member of the server to add friends" });
		}

		// Check if friend exists
		const friend = await User.findByPk(friendId);
		if (!friend) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if friend is already a member of the server
		const existingMember = await ChatMember.findOne({
			where: {
				userId: friendId,
				serverId,
			},
		});

		if (existingMember) {
			return res.status(400).json({ error: "User is already a member of this server" });
		}

		// Add friend to server
		await ChatMember.create({
			userId: friendId,
			serverId,
		});

		// Return the added user with their image
		const addedUser = await User.findByPk(friendId, {
			attributes: ["id", "username", "alias", "email", "imageId"],
			include: [
				{
					model: Image,
					attributes: ["id", "type", "url"],
					required: false,
				},
			],
		});

		// Get all server members to notify them
		const allServerMembers = await ChatMember.findAll({
			where: { serverId },
			attributes: ["userId"],
		});
		const memberIds = allServerMembers.map(m => m.userId);

		// Get server with channels for the event
		const serverWithChannels = await Server.findByPk(serverId, {
			include: [{ model: Channel }],
		});

		// Emit socket event for live updates
		const io = req.app.get('io');
		if (io && serverWithChannels) {
			const serverData = serverWithChannels.toJSON ? serverWithChannels.toJSON() : serverWithChannels;
			
			// Notify the added friend so they see the server in their list
			io.to(`user-${friendId}`).emit("serverMemberAdded", {
				server: serverData,
				addedUser: addedUser.toJSON ? addedUser.toJSON() : addedUser,
			});

			// Notify all other server members that someone joined
			memberIds.forEach(memberId => {
				if (memberId !== friendId) {
					io.to(`user-${memberId}`).emit("serverMemberAdded", {
						serverId,
						addedUser: addedUser.toJSON ? addedUser.toJSON() : addedUser,
					});
				}
			});
		}

		return res.json(addedUser);
	} catch (error) {
		console.error("Error adding friend to server:", error);
		return res.status(500).json({ error: error.message });
	}
});

// Leave a server
router.delete('/:serverId/leave', checkAuth, async (req, res) => {
	const { serverId } = req.params;
	const userId = req.user.id;

	try {
		// Check if server exists
		const server = await Server.findByPk(serverId);
		if (!server) {
			return res.status(404).json({ error: "Server not found" });
		}

		// Check if user is a member of the server
		const membership = await ChatMember.findOne({
			where: {
				userId,
				serverId,
			},
		});

		if (!membership) {
			return res.status(403).json({ error: "You are not a member of this server" });
		}

		// Get user info before removing membership
		const leavingUser = await User.findByPk(userId, {
			attributes: ["id", "username", "alias", "email", "imageId"],
			include: [
				{
					model: Image,
					attributes: ["id", "type", "url"],
					required: false,
				},
			],
		});

		// Remove membership
		await membership.destroy();

		// Get all remaining server members to notify them
		const remainingMembers = await ChatMember.findAll({
			where: { serverId },
			attributes: ["userId"],
		});
		const memberIds = remainingMembers.map(m => m.userId);

		// Emit socket event for live updates
		const io = req.app.get('io');
		if (io && leavingUser) {
			const userData = leavingUser.toJSON ? leavingUser.toJSON() : leavingUser;
			
			// Notify the leaving user so they see the server removed from their list
			io.to(`user-${userId}`).emit("serverMemberRemoved", {
				serverId,
			});

			// Notify all other server members that someone left (but server still exists for them)
			// We use a different event name so they don't remove the server from their list
			memberIds.forEach(memberId => {
				io.to(`user-${memberId}`).emit("serverMemberLeft", {
					serverId,
					removedUser: userData,
				});
			});
		}

		return res.json({ message: "Successfully left server" });
	} catch (error) {
		console.error("Error leaving server:", error);
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
