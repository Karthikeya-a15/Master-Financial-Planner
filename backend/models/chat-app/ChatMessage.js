import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
    roomId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ChatRooms",
        required : true
    },
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

ChatMessageSchema.index({roomId : 1, createdAt : -1});

const ChatMessage = mongoose.model("ChatMessages", ChatMessageSchema);

export default ChatMessage;