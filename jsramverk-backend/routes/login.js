import { Router } from 'express';
const router = Router();

import loginModel from "../models/auth.js";

router.post('/', (req, res) => loginModel.login(req, res));
router.get('/', (req, res) => loginModel.login(req, res));

export default router;
