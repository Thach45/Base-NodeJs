"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_route_1 = require("./home.route");
const users_route_1 = require("./users.route");
const setupRoutes = (app) => {
    const version = '/api/v1';
    app.use(version + '/home', home_route_1.homeRoute);
    app.use(version + '/', users_route_1.userRoute);
};
exports.default = setupRoutes;
