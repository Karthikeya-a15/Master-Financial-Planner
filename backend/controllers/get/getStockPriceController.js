import { getStockPriceByName } from "../../utils/nse.js";


export default async function getStockPriceController(req, res) {
    try{
        const { name } = req.query;
    
        const price = await getStockPriceByName(name.toLowerCase()) || 0;
        
        if(price)
            return res.json({price});
        else
            return res.json({message : "Stock Price Not Found"});
    }catch(e){
        return res.status(500).json({message : "Internal Server error" , err : e.message});
    }
}