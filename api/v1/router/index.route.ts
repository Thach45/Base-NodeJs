import { Express } from 'express';
import {homeRoute} from './home.route';
import {userRoute} from './users.route';
import chatRouter from './chat.route';
import diaryRoute from './diary.route';


const setupRoutes = (app: Express): void => {
    const version = '/api/v1';
    
    app.use(version + '/home', homeRoute);
    app.use(version + '/', userRoute);
    app.use(version + '/chat', chatRouter);
    app.use(version + '/diary', diaryRoute);
}

export default setupRoutes;