import express from 'express';

import { checkApiKey } from '../middleware/APIKEY';
import {  generateMessage, getAllAnlyze } from '../controller/chat.controller';

const router = express.Router();

// Protected chat route with API key middleware
router.post('/', checkApiKey, generateMessage);
router.post("/chart",getAllAnlyze);

export default router;