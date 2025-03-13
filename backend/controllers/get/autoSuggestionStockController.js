import { loadStockMapping } from "../../utils/nse.js";

var stocks;
var stockNames;

export default async function autoSuggestionStockController(req, res){
    if (!stocks) {
        stocks = await loadStockMapping();
        stockNames = Object.keys(stocks);
    }
    
    const { name } = req.query;
        
    // Filter stock names that include the search term (case-insensitive)
    const suggestions = stockNames.filter(stockName => stockName.toLowerCase().includes(name.toLowerCase()));
    
    return res.json({ suggestions });
}