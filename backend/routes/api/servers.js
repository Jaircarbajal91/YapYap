const express = require('express');
const { Server, ChatMember } = require("../../db/models");

const router = express.Router();

// Get all servers for current user
router.get("/", async (req, res) => {
    console.log(req.user)
    // console.log(currentUserId);
    // const servers = await Server.findAll({
    //     include: [
    //         {
    //             model: ChatMember,
    //             where: { user_id: currentUserId }
    //         }
    //     ]
    // });
    // console.log(res.json(servers))
    // return res.json(servers);
    return res.json({ message: 'hello' })
});


module.exports = router;
