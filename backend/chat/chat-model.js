import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required to send the message and store it properly.."]
    },
    message: {
        type: String,
        required: [true, "Empty messages cannot be sent..."]
    },
    email: {
        type: String
    },
    roomId: {
        type: Number
    },
    shortTime: {
        type: String
    },
    time: {
        type: String
    }
});

export const Message = mongoose.model('Message', messageSchema);