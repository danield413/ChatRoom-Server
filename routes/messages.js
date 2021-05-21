const { Router } = require("express");
const { messagesController, messagesChatController, usersMessagesController } = require("../controllers/messages");

const { validateJWT } = require("../middlewares/validate-JWT");

const router = Router();


router.get('/get-all', validateJWT, messagesController);

router.get('/get-all-chat/:sender/:recipient', validateJWT, messagesChatController);

router.get('/users-messages', usersMessagesController);

module.exports = router;