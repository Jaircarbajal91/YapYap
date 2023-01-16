const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require('../../db/models');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = require("express").Router();

const validateLogin = [
    check("credential")
        .exists({ checkFalsy:true })
        .notEmpty()
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please enter your password."),
    handleValidationErrors
];

// Log in
router.post('/login', validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;
    const user = await User.login({ credential, password });
    console.log("credential", credential, "password", password);
    if (!user) {
        const err = new Error("Login Failed");
        err.status = 401;
        err.title = "Login Failed";
        err.errors = ["The provided credentials were invalid."];
        return next(err);
    }

    const token = setTokenCookie(res, user);

    user.token = token;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    return res.json(user);
});

// Log out
router.delete('/delete', (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "successfully logged out" });
});

// Restore session user
router.get('/restore', restoreUser, (req, res) => {
    const user = req.user;
    return user ? res.json({ user: user.toSafeObject() }) : res.json({});
})

module.exports = router;
