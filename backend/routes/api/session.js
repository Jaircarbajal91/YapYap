// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth.js');
const { User, Image } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post(
  '/login',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }
    const token = await setTokenCookie(res, user);
    user.dataValues.token = token;
    user.save()
    return res.json(user);
  }
);

  // Log out
router.delete(
  '/delete',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// get all users except current user and inlcuding their images
router.get(
  '/users',
  async (req, res) => {
    const users = await User.findAll({
      attributes: ['id', 'username', 'alias', 'email', 'imageId'],
      include: { all: true, nested: true }
    });



    return res.json(users);
  }
);


// Restore session user
router.get(
  '/restore',
  restoreUser,
  async (req, res) => {
    const { user } = req;
    res.cookie('XSRF-TOKEN', req.csrfToken());
    if (user) {

      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({});
  }
);

module.exports = router;
