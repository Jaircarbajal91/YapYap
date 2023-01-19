const router = require("express").Router();
const sessionRouter = require("./session");
const usersRouter = require('./users');
const serversRouter = require('./servers');
const { restoreUser } = require("../../utils/auth");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/servers", serversRouter);

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

module.exports = router;
