import express from 'express';

import userAuth from '../middleware/userAuthMiddleware.js';

import dashBoardController from '../controllers/get/getDashBoardController.js';
import cashFlowsController from '../controllers/put/cashFlowsController.js';
import realEstatesController from '../controllers/put/realEstateController.js';
import cryptoController from '../controllers/put/cryptoController.js';
import domesticEquityController from '../controllers/put/domesticEquityController.js';
import debtController from '../controllers/put/debtController.js';
import foreignEquityController from '../controllers/put/foreignEquityController.js';
import goldController from '../controllers/put/goldController.js';
import liabilitiesController from '../controllers/put/lliabilitiesController.js';
import miscellaneousController from '../controllers/put/miscellaneousController.js';


const router = express.Router();

router.use(userAuth);

router.get("/dashboard", dashBoardController);

router.put('/cashFlows', cashFlowsController);

router.put("/realEstate", realEstatesController);

router.put("/domesticEquity", domesticEquityController);

router.put("/debt", debtController);

router.put("/liabilities",liabilitiesController);

router.put("/foreignEquity", foreignEquityController);

router.put("/gold", goldController);

router.put("/cryptoCurrency", cryptoController);

router.put("/miscellaneous",miscellaneousController);

export default router;