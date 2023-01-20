const express = require('express');
const { DirectMessage, User, ChatMember } = require("../../db/models");
const router = express.Router();

const checkAuth = (req, res, next) => !req.user ? next(new Error("Please log in or register to access this information.")) : next();

// Get all messages for a DM with user info attached
router.get("/:dm_id", async (req, res) => {
    const { dm_id } = req.params;
    const messages = await DirectMessage.findAll({ include: [{ model: User }], where: { dm_id } });
    return res.json({ Messages: messages });
});

// Create a DM
router.post("/create", checkAuth, async (req, res) => {
    const user_id = req.user.id;
    const { recipient_ids } = req.body;
    const dm = await DirectMessage.create();
    await ChatMember.create({ user_id, dm_id: dm.id });
    recipient_ids.forEach(async (recipient_id) => {
        await ChatMember.create({ user_id: recipient_id, dm_id: dm.id });
    });
    return res.json(dm);
});

// Delete a DM
router.delete("/delete/:dm_id", checkAuth, async (req, res) => {
    const { dm_id } = req.params;
    const dm = await DirectMessage.findByPk(dm_id);
    await dm.destroy();
    return res.json({ message: `successfully deleted ${dm.dataValues.dm_name}` });
});
