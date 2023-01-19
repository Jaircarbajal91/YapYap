const express = require('express');
const { Server, ChatMember } = require("../../db/models");

const router = express.Router();

const checkAuth = (req, res, next) => !req.user ? next(new Error("Please log in or register to access this information.")) : next();

// Get all servers for current user
router.get("/", checkAuth, async (req, res) => {
    const user_id = req.user.id;
    const servers = await Server.findAll({
        include: [
            {
                model: ChatMember,
                where: { user_id }
            }
        ]
    });
    console.log(res.json(servers))
    return res.json(servers);
});


module.exports = router;
