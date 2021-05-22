const Message = require("../models/message");
const MessageChat = require("../models/messageChat");
const User = require("../models/user");

const postOnDB = async ( payload ) => {
    try {

        const message = new Message(payload);
        await message.save();
        
    } catch (error) {
        console.log(error);
    }
}

const postOnDBChat = async ( payload, id1, id2 ) => {
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

const readOfDB = async () => {
    try {
        
        const messages = await Message.find().populate('user', ['_id', 'name']);
        return messages

    } catch (error) {
        console.log(error);
    }
}

const readChatOfDB = async (id1, id2) => {
    try {

        const messagesChat = await MessageChat.find({
            $or: [ { sender: id1, recipient: id2 }, { sender: id2, recipient: id1}]
        })
        return messagesChat;

    } catch (error) {
        console.log(error);  
    }
}

const getRegisteredUsers = async () => {
    try {
        
        const allUsers = await User.find({ role: 'USER' }).sort({ name : 1});

        return allUsers;

    } catch (error) {
        console.log(error);
    }
}

const moreMessages = async () => {
    try {
        
        const users = await User.find( {role: 'USER'} )
        const group = users.map( async (user) => {
            const resp = await countMessages(user._id, user.name);
            return resp;
        });

        let groupfinal = [];
        await Promise.all(group).then( res => groupfinal = res)

        const six = groupfinal.sort( (a,b) => b.messages - a.messages ).splice(0, 5);
        return six;

    } catch (error) {
        console.log(error);
    }
}

const countMessages = async ( uid, name ) => {
    const count = await Message.find( {user: uid} ).countDocuments();
    const data = { uid: uid, name: name, messages: count };
    return data;
}

module.exports = {
    postOnDB,
    readOfDB,
    postOnDBChat,
    readChatOfDB,
    getRegisteredUsers,
    moreMessages
};