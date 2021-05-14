const { Schema, model } = require('mongoose');

const MessageSchema = Schema({
    message: {
        type: String,
        required: [true, 'El mensaje es requerido']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    date: {
        type: String,
        required: [true, 'La fecha es obligatoria']
    }
})

MessageSchema.methods.toJSON = function() {
    const { __v, ...message } = this.toObject();
    return {
        ...message
    };
}

module.exports = model('Message', MessageSchema);