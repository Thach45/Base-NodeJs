import { Express } from 'express';
import {homeRoute} from './home.route';
import {userRoute} from './users.route';




const setupRoutes = (app: Express): void => {
    const version = '/api/v1';
    
    app.use(version + '/home', homeRoute);
    app.use(version + '/', userRoute);
   
}

export default setupRoutes;