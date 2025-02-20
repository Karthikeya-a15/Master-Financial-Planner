import mongoose from "mongoose";

const commonSchema = {
    domesticEquity: { type: Number, default: 0 },
    usEquity: { type: Number, default: 0 },
    debt: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    crypto: { type: Number, default: 0 },
    realEstate: { type: Number, default: 0 },
};


const ramSchema = new mongoose.Schema({
        expectedReturns : commonSchema,
        shortTerm : commonSchema,
        mediumTerm : commonSchema,
        longTerm : commonSchema
})

const RAM = mongoose.model('ReturnsAndAssets', ramSchema);

export default RAM;