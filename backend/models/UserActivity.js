import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    component: {
        type: String,
        required: true,
        enum: ['networth', 'goals', 'assumptions', 'calculators', 'tools']
    },
    action: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;