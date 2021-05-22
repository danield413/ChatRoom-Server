const Message = require("../models/message");
const MessageChat = require("../models/messageChat");

const messagesController = async(req, res) => {
    
    try {

        const messages = await Message.find().populate('user', ['_id', 'name']);

        res.json({
            messages
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

const messagesChatController = async(req, res) => {

    try {
        
        const { sender , recipient } = req.params;
        
        const messagesChat = await MessageChat.find({
            $or: [ { sender, recipient }, { sender: recipient, recipient: sender}]
        })

        res.json({
            messagesChat
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}

module.exports= {
    messagesController,
    messagesChatController,
}