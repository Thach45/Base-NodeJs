import { Express } from 'express';
import {homeRoute} from './home.route';



const setupRoutes = (app: Express): void => {
    const version = '/api/v1';
    
    app.use(version + '/home', homeRoute);
   
}

export default setupRoutes;