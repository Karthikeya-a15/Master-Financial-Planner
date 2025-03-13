import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    name : {type : String, required : true, unique : true},
    description : {type : String},
    createdAt : {type : Date, default: Date.now},
    updatedAt : {type : Date, default : Date.now}
})

const ChatRoom = mongoose.model('ChatRooms', ChatRoomSchema);

export default ChatRoom;