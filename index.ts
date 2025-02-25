
import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as database from "./config/database";
import routeApiV1 from "./api/v1/router/index.route";
dotenv.config();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(cookieParser());

database.connect();

routeApiV1(app);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});