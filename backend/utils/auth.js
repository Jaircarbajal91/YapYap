const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');
const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
    // create the token
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );
        
    const isProduction = process.env.NODE_ENV === "production";

    // set the token cookie
    res.cookie("token", token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction || true,
        sameSite: isProduction ? "Lax" : "None",
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const token = req.cookies.token;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) return next();
        try {
            const { id } = jwtPayload.data;
            req.user = await User.scope("currentUser").findByPk(id);
        } catch (err) {
            res.clearCookie("token");
            return next();
        }

        if (!req.user) res.clearCookie("token");

        return next();
    });
};

const requireAuth = (req, _res, next) => {
    if (req.user) return next();
    const err = new Error("Unauthorized");
    err.title = "Unauthorized";
    err.errors = ["Unauthorized"];
    err.status = 401;
    return next(err);
}

module.exports = { setTokenCookie, restoreUser, requireAuth };
