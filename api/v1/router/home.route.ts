import express, { Router } from 'express';
import * as home from '../controller/home.controller';
import { checkApiKey } from '../middleware/APIKEY';

const router: Router = express.Router();
router.use(checkApiKey);
router.get('/', home.index);


export const homeRoute: Router = router;