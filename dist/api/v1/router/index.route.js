"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const home_route_1 = require("./home.route");
const users_route_1 = require("./users.route");
const chat_route_1 = __importDefault(require("./chat.route"));
const setupRoutes = (app) => {
    const version = '/api/v1';
    app.use(version + '/home', home_route_1.homeRoute);
    app.use(version + '/', users_route_1.userRoute);
    app.use(version + '/chat', chat_route_1.default);
};
exports.default = setupRoutes;
