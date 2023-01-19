// backend/routes/api/users.js
const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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

const checkAuth = (req, res, next) => {
  if (!req.user) {
    const err = new Error("You must be logged in to access this information");
    next(err);
  } else {
    next();
  }
};

// Sign up
router.post("/join", validateSignup, async (req, res) => {
  const { email, password, username, image_id, alias } = req.body;
  const user = await User.signup({
    email,
    username,
    password,
    image_id,
    alias,
  });

  const token = await setTokenCookie(res, user);
  const userJSON = user.toJSON();
  userJSON.token = token;
  return res.json(userJSON);
});

// Get the Current User
router.get("/current", checkAuth, async (req, res, next) => {
  const user = await User.findByPk(req.user.id);
  return res.json(user);
});

module.exports = router;
