"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_route_1 = require("./task.route");
const user_route_1 = require("./user.route");
const setupRoutes = (app) => {
    const version = '/api/v1';
    app.use(version + '/tasks', task_route_1.taskRoute);
    app.use(version + '/user', user_route_1.userRoute);
};
exports.default = setupRoutes;
