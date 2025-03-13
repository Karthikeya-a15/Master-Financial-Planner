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
    senderName : {
        type : String
    },
    message : {
        type : String
    },
    attachment : {
        url: {type : String},
        filename: {type : String},
        type: {type : String}
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

ChatMessageSchema.index({roomId : 1, createdAt : -1});

const ChatMessage = mongoose.model("ChatMessages", ChatMessageSchema);

export default ChatMessage;