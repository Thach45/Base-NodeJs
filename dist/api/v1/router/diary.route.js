"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const APIKEY_1 = require("../middleware/APIKEY");
const diary_controller_1 = require("../controller/diary.controller");
const router = express_1.default.Router();
router.post('/', APIKEY_1.checkApiKey, diary_controller_1.analyzeParagraph);
exports.default = router;
