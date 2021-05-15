const { Schema, model } = require('mongoose');

const MessageChatSchema = Schema({
    message: {
        type: String,
        required: [true, 'El mensaje es requerido']
    },
    date: {
        type: String,
        required: [true, 'La fecha es obligatoria']
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: [true, 'El que manda el mensaje es obligatorio']
    },
    recipient: {
        type: Schema.Types.ObjectId,
        required: [true, 'El que recibe el mensaje es obligatorio']
    }
})

MessageChatSchema.methods.toJSON = function() {
    const { __v, ...message } = this.toObject();
    return {
        ...message
    };
}

module.exports = model('MessageChat', MessageChatSchema);