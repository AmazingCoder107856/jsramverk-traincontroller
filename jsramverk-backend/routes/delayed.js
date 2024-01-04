import { Router } from 'express';
const router = Router();

import { getDelayedTrains } from "../models/delayed.js";

router.get('/', (req, res) => getDelayedTrains(req, res));

export default router;
