import { Router } from 'express';
const router = Router();

import delayedModel from "../models/delayed.js";

router.get('/', (req, res) => delayedModel.getDelayedTrains(req, res));

export default router;
