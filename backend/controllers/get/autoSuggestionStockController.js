import { stockMapping } from "../../utils/stock_mapping.js";

var stockNames;

export default async function autoSuggestionStockController(req, res){
    if (!stockNames) {
        stockNames = Object.keys(stockMapping);
    }
    
    const { name } = req.query;
        
    // Filter stock names that include the search term (case-insensitive)
    const suggestions = stockNames.filter(stockName => stockName.toLowerCase().includes(name.toLowerCase()));
    
    return res.json({ suggestions });
}