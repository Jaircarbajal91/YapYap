const express = require("express");
const { DirectMessage, User, ChatMember } = require("../../db/models");
const router = express.Router();

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();


// Get all DMs for current user with user info attached
router.get("/", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const allMessages = await DirectMessage.findAll({
		include: [{ model: ChatMember, include: [{ model: User }] }]
	});
	const messages = allMessages.filter(message => {
		const members = message.dataValues.ChatMembers;
		const memberIds = members.map(member => member.dataValues.userId);
		return memberIds.includes(userId);
	});
	return res.json({ messages });
});


// Get all messages for a DM with user info attached
router.get("/:dmId", async (req, res) => {
	const { dmId } = req.params;
	const messages = await DirectMessage.findAll({
		include: [{ model: ChatMember, include: [{ model: User }] }],
		where: { id: dmId },
	});
	return res.json({ Messages: messages });
});

// Create a DM
router.post("/create", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const { recipientIds } = req.body;
	const io = req.app.get('io');
	const dm = await DirectMessage.create();
	await ChatMember.create({ userId, dmId: dm.id });
	
	// Create all chat members and collect their IDs
	const allMemberIds = [userId, ...recipientIds];
	for (const recipientId of recipientIds) {
		await ChatMember.create({ userId: recipientId, dmId: dm.id });
	}
	
	const message = await DirectMessage.findByPk(dm.id, {
		include: [{ model: ChatMember, include: [{ model: User }] }]
	});

	// Emit socket event to all members for live DM creation
	if (io && message) {
		const dmData = message.toJSON ? message.toJSON() : message;
		allMemberIds.forEach(memberId => {
			io.to(`user-${memberId}`).emit("directMessageCreated", {
				directMessage: dmData,
			});
		});
	}

	return res.json(message);
});

// Delete a DM
router.delete("/delete/:dmId", checkAuth, async (req, res) => {
	const { dmId } = req.params;
	const userId = req.user.id;
	const io = req.app.get('io');
	try {
		const dm = await DirectMessage.findByPk(dmId, {
			include: [{ model: ChatMember }]
		});
		
		if (!dm) {
			return res.status(404).json({ error: "Direct message not found" });
		}

		// Check if user is a member of this DM
		const isMember = dm.ChatMembers.some(member => member.userId === userId);
		if (!isMember) {
			return res.status(403).json({ error: "You are not a member of this direct message" });
		}

		// Get all member IDs before destroying
		const memberIds = dm.ChatMembers.map(member => member.userId);

		await dm.destroy();

		// Emit socket event to all members for live DM deletion
		if (io) {
			memberIds.forEach(memberId => {
				io.to(`user-${memberId}`).emit("directMessageDeleted", {
					dmId,
				});
			});
		}

		return res.json({ message: "Direct message deleted successfully" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
