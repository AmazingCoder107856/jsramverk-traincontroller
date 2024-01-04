import { Router } from 'express';
const router = Router();

import { getTickets, createTicket } from "../models/tickets.js";

router.get('/', (req, res) => getTickets(req, res));

router.post('/', (req, res) => createTicket(req, res));

export default router;
