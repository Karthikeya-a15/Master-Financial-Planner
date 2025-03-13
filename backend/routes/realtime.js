import { Router } from "express";
import getRealTimeDataController from '../controllers/get/getRealTimeData.js';
import autoSuggestionMFController from "../controllers/get/autoSuggestionMFController.js";
import autoSuggestionStockController from "../controllers/get/autoSuggestionStockController.js";
import getStockPriceController from "../controllers/get/getStockPriceController.js";

const router = Router();


// router.get("/realTimeData", getRealTimeDataController);

router.get("/autoSuggestionMF", autoSuggestionMFController);

router.get("/autoSuggestionStocks", autoSuggestionStockController)

router.get("/stockPrice", getStockPriceController);
export default router;
