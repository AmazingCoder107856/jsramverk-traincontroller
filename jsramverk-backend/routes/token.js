import { Router } from 'express';
const router = Router();

import tokenModel from "../models/auth.js";

router.get('/', (req, res) => tokenModel.createToken(req, res));

export default router;
