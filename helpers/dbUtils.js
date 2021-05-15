const Message = require("../models/message");
const MessageChat = require("../models/messageChat");

const postOnDB = async( payload ) => {
    try {

        const message = new Message(payload);
        await message.save();
        
    } catch (error) {
        console.log(error);
    }
}

const postOnDBChat = async( payload, id1, id2 ) => {
    try {

        const { message, date } = payload;
        const data = {
            message,
            date,
            sender: id1,
            recipient: id2
        }
        const messageChat = new MessageChat(data);
        await messageChat.save();

    } catch (error) {
        console.log(error);
    }
}

const readOfDB = async() => {
    try {
        
        const messages = await Message.find().populate('user', ['_id', 'name']);
        return messages

    } catch (error) {
        console.log(error);
    }
}

const readChatOfDB = async(id1, id2) => {
    try {

        const messagesChat = await MessageChat.find({
            $or: [ { sender: id1, recipient: id2 }, { sender: id2, recipient: id1}]
        })
        return messagesChat;

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    postOnDB,
    readOfDB,
    postOnDBChat,
    readChatOfDB
};