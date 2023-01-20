const express = require('express');
const { Server, ChatMember, Channel } = require("../../db/models");

const router = express.Router();

const checkAuth = (req, res, next) => !req.user ? next(new Error("Please log in or register to access this information.")) : next();

// Get all servers for current user
router.get("/", checkAuth, async (req, res) => {
    const user_id = req.user.id;
    // find all servers that the user is a member or, the channels in those servers
    const chatMembers = await ChatMember.findAll({
        include: [{ model: Server, include: [{ model: Channel }] }],
        where: { user_id }
    });

    const result = [];
    chatMembers.forEach(chatMember => {
        const server = chatMember.dataValues.Server;
        server && result.push(server);
    });
    return res.json({ Servers: result });
});


// Create a server
router.post("/create", checkAuth, async (req, res) => {
    const { server_name, image_id, owner_id } = req.body;
    const server = await Server.create({ server_name, image_id, owner_id });
    return res.json(server);
});

// Create a channel in active server
router.post("/:server_id/create-channel", checkAuth, async (req, res) => {
    const { server_id } = req.params;
    const { channel_name } = req.body;
    const channel = await Channel.create({ server_id, channel_name });
    return res.json(channel);
});


// Delete a server
router.delete("/delete/:server_id", checkAuth, async (req, res) => {
    const { server_id } = req.params;
    const server = await Server.findByPk(server_id);
    await server.destroy();
    return res.json({ message: `successfully deleted ${server.dataValues.server_name}` });
});


// Update a server
router.put("/update/:server_id", checkAuth, async (req, res) => {
    const { server_id } = req.params;
    const { server_name, image_id } = req.body;
    const server = await Server.findByPk(server_id);
    try {
        server_name && (server.server_name = server_name);
        await server.save();
    } catch (e) {
        return res.status(400).json({ message: "Invalid server name" });
    }
    try {
        image_id && (server.image_id = image_id);
        await server.save();
    } catch (e) {
        return res.status(400).json({ message: "Invalid image id" });
    }
    return res.json(server);
})



module.exports = router;
