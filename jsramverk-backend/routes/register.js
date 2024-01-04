import { Router } from 'express';
const router = Router();

import { register } from "../models/auth.js";

router.post('/', (req, res) => register(req, res));
router.get('/', (req, res) => register(req, res));

export default router;
