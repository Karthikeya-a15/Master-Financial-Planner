import mongoose from "mongoose";

const goldSchema = new mongoose.Schema({
    jewellery : {
        type : Number,
        default: 0
    },
    SGB : {
        type : Number,
        default: 0
    },
    digitalGoldAndETF : {
        type : Number,
        default: 0
    },
   
});

const GoldModel = mongoose.model('Gold', goldSchema);

export default GoldModel;