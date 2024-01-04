import { Router } from 'express';
const router = Router();

import { login } from "../models/auth.js";

router.post('/', (req, res) => login(req, res));
router.get('/', (req, res) => login(req, res));

export default router;
