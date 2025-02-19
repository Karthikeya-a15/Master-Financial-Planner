import mongoose from "mongoose";

const GoalSchema = mongoose.Schema({
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
    }
    
})


const Goals = mongoose.model('Goals', GoalSchema);

export default Goals;