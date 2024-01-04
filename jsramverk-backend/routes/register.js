import { Router } from 'express';
const router = Router();

import registerModel from "../models/auth.js";

router.post('/', (req, res) => registerModel.register(req, res));
router.get('/', (req, res) => registerModel.register(req, res));

export default router;
