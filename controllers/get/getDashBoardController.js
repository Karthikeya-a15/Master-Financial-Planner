import Liabilities from "../../models/Liabilities.js";
import getNetWorth  from "../../common/getNetWorth.js";
import User from "../../models/User.js";

export default async function getDashBoardController(req, res){
    try{
        const userid = req.user;
        const user = await User.findById(userid);
        const {illiquid , liquid, message} = await getNetWorth(userid);
        if(message){
            return res.status(500).json({message}); 
        }
        const liability = await Liabilities.findById(user.netWorth.liabilities);
        // console.log(illiquid);
        const liabilities = {
            homeLoan : liability.homeLoan,
            educationLoan : liability.educationLoan,
            carLoan : liability.carLoan,
            personalLoan : liability.personalLoan,
            creditCard : liability.creditCard,
            other : liability.other
        }

        return res.status(200).json({illiquid, liquid, liabilities});
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }

}
