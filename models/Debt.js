import mongoose from "mongoose";

const debtSchema = new mongoose.Schema({
    liquidFund : {
        type : [
            {
                particulars : { type: String },
                currentValue: { type: Number }
            }
        ],
        default : []
    },
    fixedDeposit : {
        type : [
            {
                bankName : { type: String },
                currentValue: { type: Number}
            }
        ],
        default : []
    },
    debtFunds : {
        type : [
            {
                name : { type: String },
                currentValue: { type: Number }
            }
        ],
        default: []
    },
    governmentInvestments : {
        type: [
            {
                name : { type: String },
                currentValue: { type: Number }
            }
        ],
        default: []
    },
    sipDebt : {
        type: [
            {
                name : { type: String },
                duration: { 
                    type: String, 
                    enum: ["FD", "RD", "Arbitrage", "Banking PSU", "Corporate funds","Goverment Securities","Equity Saver"], 
                },
                currentValue: { type: Number }
            }
        ],
        default: []
    }
});

const Debt = mongoose.model('Debt', debtSchema);

export default Debt;