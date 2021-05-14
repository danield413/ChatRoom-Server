const Message = require("../models/message")

const messagesController = async(req, res) => {
    
    const messages = await Message.find().populate('user', ['_id', 'name']);

    res.json({
        messages
    });

}

module.exports= {
    messagesController
}