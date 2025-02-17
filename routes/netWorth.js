import express from 'express';

import userAuth from '../middleware/userAuthMiddleware.js';

import cashFlowsController from '../controllers/cashFlowsController.js';
import realEstatesController from '../controllers/realEstateController.js';
import cryptoController from '../controllers/cryptoController.js';
import domesticEquityController from '../controllers/domesticEquityController.js';
import debtController from '../controllers/debtController.js';
import foreignEquityController from '../controllers/foreignEquityController.js';
import goldController from '../controllers/goldController.js';
import liabilitiesController from '../controllers/lliabilitiesController.js';
import miscellaneousController from '../controllers/miscellaneousController.js';

const router = express.Router();

router.use(userAuth);


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