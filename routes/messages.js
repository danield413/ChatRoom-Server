const { Router } = require("express");
const { messagesController } = require("../controllers/messages");

const { validateJWT } = require("../middlewares/validate-JWT");

const router = Router();



router.get('/get-all', validateJWT, messagesController)


module.exports = router;