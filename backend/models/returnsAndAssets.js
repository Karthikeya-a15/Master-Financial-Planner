import mongoose from "mongoose";

const ramSchema = new mongoose.Schema({
        expectedReturns : {
            domesticEquity: { type: Number, default: 12 },
            usEquity: { type: Number, default: 12 },
            debt: { type: Number, default: 6 },
            gold: { type: Number, default: 6 },
            crypto: { type: Number, default: 20 },
            realEstate: { type: Number, default: 10 },
        },
        shortTerm : {
            domesticEquity: { type: Number, default: 0 },
            usEquity: { type: Number, default: 0 },
            debt: { type: Number, default: 100 },
            gold: { type: Number, default: 0 },
            crypto: { type: Number, default: 0 },
            realEstate: { type: Number, default: 0 },
        },
        mediumTerm : {
            domesticEquity: { type: Number, default: 40 },
            usEquity: { type: Number, default: 0 },
            debt: { type: Number, default: 50 },
            gold: { type: Number, default: 10 },
            crypto: { type: Number, default: 0 },
            realEstate: { type: Number, default: 0 },
        },
        longTerm : {
            domesticEquity: { type: Number, default: 60 },
            usEquity: { type: Number, default: 10 },
            debt: { type: Number, default: 15 },
            gold: { type: Number, default: 5 },
            crypto: { type: Number, default: 5 },
            realEstate: { type: Number, default: 5 },
        },
        effectiveReturns : {
            shortTermReturns : {type : Number, default: 6 },
            mediumTermReturns : {type : Number, default: 8.4},
            longTermReturns : {type : Number, default : 11.1}
        }
})

const RAM = mongoose.model('ReturnsAndAssets', ramSchema);

export default RAM;