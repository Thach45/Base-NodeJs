"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield user_model_1.default.findOne({ email: req.body.email });
        if (emailExist) {
            res.status(400).json({
                message: "Email already exists"
            });
        }
        else {
            const user = new user_model_1.default(Object.assign(Object.assign({}, req.body), { password: (0, md5_1.default)(req.body.password) }));
            const use = yield user.save();
            const token = use.token;
            res.cookie("token", token);
            res.status(200).json({
                message: "Register Success",
                data: user,
                token: token
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
});
exports.register = register;
