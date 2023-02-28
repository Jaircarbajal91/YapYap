const express = require("express");
const { DirectMessage, User, ChatMember } = require("../../db/models");
const router = express.Router();

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information."))
		: next();


// Get all DMs for current user
router.get("/", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const chatMembers = await ChatMember.findAll({
		include: [{ model: DirectMessage }],
		where: { userId },
	});
	const result = [];
	chatMembers.forEach(chatMember => {
		const dm = chatMember.DirectMessage;
		if (dm) result.push(dm);
	});
	return res.json({ Messages: result });
});


// Get all messages for a DM with user info attached
router.get("/:dmId", async (req, res) => {
	const { dmId } = req.params;
	const messages = await DirectMessage.findAll({
		include: [{ model: User }],
		where: { dmId },
	});
	return res.json({ Messages: messages });
});

// Create a DM
router.post("/create", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const { recipientIds } = req.body;
	const dm = await DirectMessage.create();
	await ChatMember.create({ userId, dmId: dm.id });
	recipientIds.forEach(async recipientId => {
		await ChatMember.create({ userId: recipientId, dmId: dm.id });
	});
	return res.json(dm);
});

// Delete a DM
router.delete("/delete/:dmId", checkAuth, async (req, res) => {
	const { dmId } = req.params;
	const dm = await DirectMessage.findByPk(dmId);
	await dm.destroy();
	return res.json({ message: `successfully deleted ${dm.dataValues.dm_name}` });
});

module.exports = router;
