import { Router } from 'express';
const router = Router();

import { getCodes } from "../models/codes.js";

router.get('/', (req, res) => getCodes(req, res));

export default router;
