import mongoose from "mongoose";

const foreignEquitySchema = new mongoose.Schema({  
    sAndp500: {
        type: Number,
        default: 0
    },
    otherETF : {
        type: Number,
        default: 0
    },
    mutualFunds : {
        type: Number,
        default: 0
    }
});

const ForeignEquity = mongoose.model('ForeignEquity', foreignEquitySchema);

export default ForeignEquity;