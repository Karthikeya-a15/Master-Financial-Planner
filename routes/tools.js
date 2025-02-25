import express from "express";

import userAuth from "../middleware/userAuthMiddleware.js";

import getToolsController from  "../controllers/get/getIndexFundsController.js";
import indexFundsController from "../controllers/post/indexFundsController.js";
import mutualFundsConroller from "../controllers/post/mutualFundsController.js";
import debtFundsController from "../controllers/post/debtFundsController.js";
import arbitrageController from "../controllers/post/arbitrageController.js";

const router = express.Router();

router.use(userAuth);

router.get("/indexfunds",getToolsController);

router.post("/indexfunds",indexFundsController);

router.post("/mutualfunds",mutualFundsConroller);

router.post("/debtfunds",debtFundsController);

router.post("/arbitrage",arbitrageController);

export default router;