const Message = require("../models/message");
const MessageChat = require("../models/messageChat");
const user = require("../models/user");
const User = require("../models/user");

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

const usersMessagesController = async (req,res) => {

    const users = await User.find( {role: 'USER'} )
    const group = users.map( async (user) => {
        const resp = await countMessages(user._id, user.name);
        return resp;
    });

    let groupfinal = [];
    await Promise.all(group).then( res => groupfinal = res)

    res.json(groupfinal)

}

const countMessages = async ( uid, name ) => {
    const count = await Message.find( {user: uid} ).countDocuments();
    const data = { uid: uid, name: name, count };
    return data;
}

module.exports= {
    messagesController,
    messagesChatController,
    usersMessagesController
}