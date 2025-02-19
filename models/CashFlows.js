import mongoose from "mongoose";

const CashFlowsSchema = new mongoose.Schema({
    inflows: {
        postTaxSalary: {
            type: Number,
            default: 0
        },
        businessIncome: {
            type: Number,
            default: 0
        },
        rentalIncome: {
            type: Number,
            default: 0
        },
        otherIncome: {
            type: Number,
            default: 0
        }
    },
    outflows: {
        monthlyExpenses: {
            type: Number,
            default: 0
        },
        compulsoryInvestments: {
            type: Number,
            default: 0
        },
        emis: {
            type: Number,
            default: 0
        },
        insurance: {
            type: Number,
            default: 0
        },
        others: {
            type: Number,
            default: 0
        }
    }
});

const CashFlows = mongoose.model('CashFlows', CashFlowsSchema);

export default CashFlows;