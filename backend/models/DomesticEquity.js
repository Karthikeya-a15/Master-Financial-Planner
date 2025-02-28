import mongoose, { Mongoose } from "mongoose";

const domesticEquitySchema = new mongoose.Schema({
    directStocks: {
        type: [
            {
                stockName: { type: String},
                category: { 
                    type: String, 
                    enum: ["large cap", "mid cap", "small cap"], 
                },
                currentValue: { type: Number, default: 0 }
            }
        ],
        default: []
    },
    mutualFunds: {
        type: [
            {
                fundName: { type: String },
                category: { 
                    type: String, 
                    enum: ["large cap", "mid cap", "small cap", "flexi cap", "multi cap"], 
                },
                currentValue: { type: Number, default: 0 }
            }
        ],
        default: []
    },
    sipEquity : {
        type: [
            {
                sipName: { type: String },
                category: { 
                    type: String, 
                    enum: ["large cap", "mid cap", "small cap", "flexi cap", "multi cap"], 
                },
                sip: { type: Number, default: 0 }
            }
        ],
        default: []
    }
});

const DomesticEquity = mongoose.model('DomesticEquity', domesticEquitySchema);

export default DomesticEquity;