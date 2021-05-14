const Message = require("../models/message");

const postOnDB = async( payload ) => {
    const message = new Message(payload);
    await message.save();
}

const readOfDB = async() => {
    const messages = await Message.find().populate('user', ['_id', 'name']);
    return messages
}

module.exports = {
    postOnDB,
    readOfDB
};