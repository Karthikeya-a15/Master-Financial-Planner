import mongoose from "mongoose";

const RoomMembersSchema = new mongoose.Schema({
    roomId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "ChatRooms",
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    joinedAt : {
        type : Date,
        default : Date.now
    }
})

const RoomMembers = mongoose.model("RoomMembers", RoomMembersSchema);

export default RoomMembers;