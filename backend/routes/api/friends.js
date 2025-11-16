const express = require("express");
const { Friend, User, Image } = require("../../db/models");
const router = express.Router();
const { Op } = require("sequelize");

const checkAuth = (req, res, next) => {
	if (!req.user) {
		const err = new Error("Please log in or register to access this information.");
		err.status = 401;
		return next(err);
	}
	return next();
};

// Get all friends for current user
router.get("/", checkAuth, async (req, res) => {
	const userId = req.user.id;
	try {
		// First get all friend IDs
		const friendships = await Friend.findAll({
			where: { userId },
			attributes: ["friendId"],
		});

		const friendIds = friendships.map(f => f.friendId);
		
		if (friendIds.length === 0) {
			return res.json([]);
		}

		// Then fetch the users directly
		const friends = await User.findAll({
			where: {
				id: {
					[Op.in]: friendIds,
				},
			},
			attributes: ["id", "username", "alias", "email", "imageId"],
			include: [
				{
					model: Image,
					attributes: ["id", "type", "url"],
					required: false,
				},
			],
		});

		return res.json(friends);
	} catch (error) {
		console.error("Error fetching friends:", error);
		return res.status(500).json({ error: error.message });
	}
});

// Add a friend
router.post("/", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const { friendId } = req.body;

	if (!friendId) {
		return res.status(400).json({ error: "friendId is required" });
	}

	if (userId === friendId) {
		return res.status(400).json({ error: "Cannot add yourself as a friend" });
	}

	try {
		// Check if friend exists
		const friendUser = await User.findByPk(friendId);
		if (!friendUser) {
			return res.status(404).json({ error: "User not found" });
		}

		// Check if friendship already exists (in either direction)
		const existingFriendship = await Friend.findOne({
			where: {
				[Op.or]: [
					{ userId, friendId },
					{ userId: friendId, friendId: userId },
				],
			},
		});

		if (existingFriendship) {
			return res.status(400).json({ error: "Friendship already exists" });
		}

		// Create friendship
		const friendship = await Friend.create({ userId, friendId });
		const friend = await User.findByPk(friendId, {
			attributes: ["id", "username", "alias", "email", "imageId"],
			include: [
				{
					model: Image,
					attributes: ["id", "type", "url"],
				},
			],
		});

		return res.json(friend);
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// Remove a friend
router.delete("/:friendId", checkAuth, async (req, res) => {
	const userId = req.user.id;
	const { friendId } = req.params;

	try {
		const friendship = await Friend.findOne({
			where: {
				[Op.or]: [
					{ userId, friendId },
					{ userId: friendId, friendId: userId },
				],
			},
		});

		if (!friendship) {
			return res.status(404).json({ error: "Friendship not found" });
		}

		await friendship.destroy();
		return res.json({ message: "Friend removed successfully" });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

// Get users who are not friends (for adding friends)
router.get("/non-friends", checkAuth, async (req, res) => {
	const userId = req.user.id;
	try {
		// Get all friend IDs (both directions)
		// If Friends table doesn't exist yet, this will return empty array
		let friendships = [];
		try {
			friendships = await Friend.findAll({
				where: {
					[Op.or]: [{ userId }, { friendId: userId }],
				},
			});
		} catch (err) {
			// Friends table might not exist yet, continue with empty array
			console.log("Friends table might not exist yet:", err.message);
		}

		const friendIds = new Set();
		friendships.forEach((friendship) => {
			if (friendship.userId === userId) {
				friendIds.add(friendship.friendId);
			} else {
				friendIds.add(friendship.userId);
			}
		});
		friendIds.add(userId); // Exclude self

		// Get all users except current user and friends
		const nonFriends = await User.findAll({
			where: {
				id: {
					[Op.notIn]: friendIds.size > 0 ? Array.from(friendIds) : [userId],
				},
			},
			attributes: ["id", "username", "alias", "email", "imageId"],
			include: [
				{
					model: Image,
					attributes: ["id", "type", "url"],
				},
			],
		});

		return res.json(nonFriends);
	} catch (error) {
		console.error("Error fetching non-friends:", error);
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;

