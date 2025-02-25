"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genToken = void 0;
const genToken = (length) => {
    return Math.random().toString(36).substring(2, length + 2);
};
exports.genToken = genToken;
