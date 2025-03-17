import express from "express";

import userAuth from "../middleware/userAuthMiddleware.js";


import indexFundsController from "../controllers/get/indexFundsController.js";
import debtFundsController from "../controllers/get/debtFundsController.js";
import mutualFundsConroller from "../controllers/get/mutualFundsController.js";
import arbitrageController from "../controllers/get/arbitrageController.js";
import equitySaverController from "../controllers/get/equitySaverController.js";

const router = express.Router();

router.use(userAuth);

// router.get("/indexfunds",getToolsController);

router.get("/indexfunds",indexFundsController);

router.get("/mutualfunds",mutualFundsConroller);

router.get("/debtfunds",debtFundsController);

router.get("/arbitrage",arbitrageController);

router.get("/equitysaver",equitySaverController);

export default router;