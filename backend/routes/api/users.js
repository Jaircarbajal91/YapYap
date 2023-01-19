const express = require('express');
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie } = require("../../utils/auth");

const router = express.Router();

const validateSignup = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email address."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4, max: 20 })
        .withMessage("Username must be between 4 and 20 charactaers."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters."),
    handleValidationErrors
];

const checkAuth = (req, res, next) => !req.user ? next(new Error("Please log in or register to access this information.")) : next();

// Register / Sign Up
router.post('/join', validateSignup, async (req, res) => {
    const { username, email, password, alias, image_id } = req.body;
    const user = await User.signup({ username, email, password, alias, image_id });
    const token = await setTokenCookie(res, user);
    user.token = token;
    return res.json(user);
});

// Get Current User
router.get('/current', checkAuth, async (req, res) => res.json(await User.findByPk(req.user.id)))

module.exports = router;
