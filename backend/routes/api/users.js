// backend/routes/api/users.js
const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
	check("email")
		.exists({ checkFalsy: true })
		.isEmail()
		.withMessage("Please provide a valid email."),
	check("username")
		.exists({ checkFalsy: true })
		.isLength({ min: 4 })
		.withMessage("Please provide a username with at least 4 characters."),
	check("username").not().isEmail().withMessage("Username cannot be an email."),
	check("password")
		.exists({ checkFalsy: true })
		.isLength({ min: 6 })
		.withMessage("Password must be 6 characters or more."),
	handleValidationErrors,
];

const checkAuth = (req, res, next) =>
	!req.user
		? next(new Error("Please log in or register to access this information"))
		: next();

// Sign up
router.post("/signup", validateSignup, async (req, res) => {
	const { email, password, username, imageId, alias } = req.body;
	const foundUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
	if (foundUser) {
		return res.status(401).json({ errors: ["User already exists"] });
	}
	const user = await User.signup({
		email,
		username,
		password,
		imageId,
		alias,
	});

	const token = await setTokenCookie(res, user);
	user.dataValues.token = token;
	return res.json(user);
});

// Get the Current User
router.get("/current", checkAuth, async (req, res, next) =>
	res.json(await User.findByPk(req.user.id))
);

module.exports = router;
