import { Router } from 'express';
const router = Router();

import codesModel from "../models/codes.js";

router.get('/', (req, res) => codesModel.getCodes(req, res));

export default router;
