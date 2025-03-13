import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import  {NSELive} from "nse-api-package";

const nseLive = new NSELive();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STOCK_MAPPING_FILE = join(__dirname, "stock_mapping.json");

// Function to load stock mapping from JSON file
export function loadStockMapping() {
  if (fs.existsSync(STOCK_MAPPING_FILE)) {
    const data = fs.readFileSync(STOCK_MAPPING_FILE, "utf-8");
    return JSON.parse(data);
  }
  return {};
}

var stockMapping;
// Function to fetch stock price
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

  if(!stockMapping){
    stockMapping = loadStockMapping();
  }
  return stockMapping[stockName.toLowerCase()] || "Stock not found";
}

export async function getStockPriceByName(stockName) {
  const symbol = getStockSymbolByName(stockName);
  if (symbol !== "Stock not found") {
    const price = await getStockPrice(symbol);
    // console.log(`Stock Price for ${stockName} (${symbol}): \n${price}`);
    return price;
  } else {
    console.log(`Stock ${stockName} not found.`);
  }
}

// getStockPriceByName("tata elxsi limited")