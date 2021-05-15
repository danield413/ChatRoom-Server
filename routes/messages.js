const { Router } = require("express");
const { messagesController, messagesChatController } = require("../controllers/messages");

const { validateJWT } = require("../middlewares/validate-JWT");

const router = Router();


router.get('/get-all', validateJWT, messagesController);

router.get('/get-all-chat/:sender/:recipient', validateJWT, messagesChatController);



module.exports = router;