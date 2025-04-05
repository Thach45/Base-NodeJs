import express, { Router } from 'express';

import { checkApiKey } from '../middleware/APIKEY';
import { analyzeParagraph } from '../controller/diary.controller';

const router = express.Router();

router.post('/', checkApiKey, analyzeParagraph);

export default router;