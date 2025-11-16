const router = require("express").Router();
const sessionRouter = require("./session");
const usersRouter = require('./users');
const serversRouter = require('./servers');
const channelsRouter = require('./channels');
const imagesRouter = require('./images');
const messagesRouter = require('./messages');
const directMessage = require('./directMessages');
const friendsRouter = require('./friends');
const { restoreUser } = require("../../utils/auth");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/servers", serversRouter);
router.use("/channels", channelsRouter);
router.use("/images", imagesRouter);
router.use("/messages", messagesRouter);
router.use("/directmessages", directMessage);
router.use("/friends", friendsRouter);

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });

module.exports = router;
