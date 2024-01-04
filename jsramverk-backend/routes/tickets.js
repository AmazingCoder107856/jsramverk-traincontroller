import { Router } from 'express';
const router = Router();

import ticketsModel from "../models/tickets.js";

router.get('/', (req, res) => ticketsModel.getTickets(req, res));

router.post('/', (req, res) => ticketsModel.createTicket(req, res));

export default router;
