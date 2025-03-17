import CryptoCurrency from "../../models/CryptoCurrency.js";
import User from "../../models/User.js";


export default async function getCryptoController(req, res) {
    const userId = req.user;

    try{
        const user = await User.findById(userId);
        
        const userCrypto = await CryptoCurrency.findById(user.netWorth.cryptocurrency).select('-_id -__v');
        
        if(userCrypto)
            return res.json({cryptoCurrency : userCrypto });
        else
            return res.json({message : "Error while Fetching Cryptocurrency "});

    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}