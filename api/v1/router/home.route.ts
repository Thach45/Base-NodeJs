import express, { Router } from 'express';
import * as home from '../controller/home.controller';
import { checkApiKey } from '../middleware/APIKEY';
import { verifyToken } from '../middleware/JWT.middleware';

const router: Router = express.Router();
router.use(checkApiKey);
router.get('/',verifyToken, home.index);


export const homeRoute: Router = router;