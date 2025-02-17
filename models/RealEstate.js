import mongoose from "mongoose";

const RealEstateSchema = new mongoose.Schema({
    home : {
        type : Number,
        default: 0
    },
    otherRealEstate : {
        type : Number,
        default: 0
    },
    REITs : {
        type : Number,
        default: 0
    }
});

const RealEstate = mongoose.model('RealEstate', RealEstateSchema);

export default RealEstate;