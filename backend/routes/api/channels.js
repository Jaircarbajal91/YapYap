const express = require("express");
const { Server, Channel, Message, User } = require("../../db/models");

const router = express.Router();

const checkAuth = (req, res, next) => !req.user ? next(new Error("Please log in or register to access this information.")) : next();

// Create a channel
router.post("/create", checkAuth, async (req, res) => {
    const isOwner = await Server.findOne({
        where: {
            owner_id: req.user.id,
            id: req.body.server_id
        }
    });
    const { server_id, channel_name } = req.body;
    const channel = await Channel.create({ server_id, channel_name });
    return res.json(channel);
});

// Delete a channel
router.delete("/delete/:channel_id", checkAuth, async (req, res) => {
    const { channel_id } = req.params;
    const channel = await Channel.findByPk(channel_id);
    const isOwner = await Server.findOne({
        where: {
            owner_id: req.user.id,
            id: channel.server_id
        }
    });
    if (!isOwner) return res.status(401).json({ message: "You are not authorized to delete this channel." });
    await channel.destroy();
    return res.json({ message: `successfully deleted ${channel.dataValues.channel_name}` });
});


// Update a channel
router.put("/update/:channel_id", checkAuth, async (req, res) => {
    const { channel_id } = req.params;
    const { channel_name } = req.body;
    const channel = await Channel.findByPk(channel_id);
    const isOwner = await Server.findOne({
        where: {
            owner_id: req.user.id,
            id: channel.server_id
        }
    });
    if (!isOwner) return res.status(401).json({ message: "You are not authorized to update this channel." });
    try {
        channel_name && (channel.channel_name = channel_name);
        await channel.save();
    } catch (e) {
        return res.status(400).json({ message: "Invalid channel name" });
    }
    return res.json(channel);
});

modules.exports = router;
