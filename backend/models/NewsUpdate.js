import mongoose from "mongoose";

const newsUpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['market_update', 'investment_tip', 'announcement'],
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    publishedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

const NewsUpdate = mongoose.model('NewsUpdate', newsUpdateSchema);

export default NewsUpdate;