import mongoose from "mongoose";

const NetWorthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cashFlows : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CashFlows',
    },
    domesticEquity : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DomesticEquity',
    },
    debt : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Debt',
    },
    realEstate : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RealEstate',
    },
    foreignEquity : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForeignEquity',
    },
    cryptocurrency : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CryptoCurrency',
    },
    gold : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gold',
    },
    liabilities : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liabilities',
    },
    miscellaneous : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Miscellaneous',
    }
});

const NetWorth = mongoose.model('NetWorth', NetWorthSchema);

export default NetWorth;