import  {NSELive} from "nse-api-package";
import { stockMapping } from "./stock_mapping.js";

const nseLive = new NSELive();

async function getStockPrice(symbol) {
  try {
    const data = await nseLive.stockQuote(symbol);
    return data?.priceInfo?.lastPrice || "Price Not Available";
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return "Error fetching price";
  }
}



// Function to get stock symbol by name
function getStockSymbolByName(stockName) {
  return stockMapping[stockName.toLowerCase()] || "Stock not found";
}

export async function getStockPriceByName(stockName) {
  const symbol = getStockSymbolByName(stockName);
  if (symbol !== "Stock not found") {
    const price = await getStockPrice(symbol);
    return price;
  } else {
    console.log(`Stock ${stockName} not found.`);
  }
}

// getStockPriceByName("tata elxsi limited")