import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
    goals : {
        type : [
            {
                goalName : {
                    type : String,
                    require : true
                },
                time : {
                    type : Number,
                    require : true
                },
                amountRequiredToday : {
                    type : Number,
                    require : true
                },
                amountAvailableToday : {
                    type : Number,
                    require : true
                },
                goalInflation : {
                    type : Number,
                    require : true
                },
                stepUp : {
                    type : Number,
                    default : 0
                },
                sipRequired : {
                    type : Number,
                    require : true
                }

            }

        ],
        default : []
    },
    sipAssestAllocation: {
        type: {
            domesticEquity: { type: Number, default: 0 },
            usEquity: { type: Number, default: 0 },
            debt: { type: Number, default: 0 },
            gold: { type: Number, default: 0 },
            crypto: { type: Number, default: 0 },
            realEstate: { type: Number, default: 0 }
        },
        default: {}
    }
    
})


const Goals = mongoose.model('Goals', GoalSchema);

export default Goals;