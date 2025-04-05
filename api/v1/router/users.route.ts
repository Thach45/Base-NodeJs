import express, { Router } from 'express';
import * as user from '../controller/users.controller';
import { checkApiKey } from '../middleware/APIKEY';

const router: Router = express.Router();
router.use(checkApiKey);
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/refresh', user.refreshToken);
router.post('/logout', user.logout);


export const userRoute: Router = router;