import express from 'express';

import { checkApiKey } from '../middleware/APIKEY';
import { generateMessage } from '../controller/chat.controller';

const router = express.Router();

// Protected chat route with API key middleware
router.post('/', checkApiKey, generateMessage);

export default router;