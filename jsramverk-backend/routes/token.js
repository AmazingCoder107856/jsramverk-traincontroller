import { Router } from 'express';
const router = Router();

import { createToken } from "../models/auth.js";

router.get('/', (req, res) => createToken(req, res));

export default router;
