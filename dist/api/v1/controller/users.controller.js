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
exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../../../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existEmail = yield user_model_1.default.findOne({ email }).lean();
    if (existEmail) {
        res.status(400).json({
            status: 'error',
            message: 'Email already exists',
        });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = new user_model_1.default({
        email,
        password: hashedPassword,
        role: 'user'
    });
    newUser.save()
        .then(() => {
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });
    })
        .catch((error) => {
        res.status(500).json({
            status: 'error',
            message: 'Error registering user',
            error: error.message
        });
    });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const auth = yield user_model_1.default.findOne({ email }).lean();
    if (!auth) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid email or password',
        });
        return;
    }
    if (!auth || !(yield bcryptjs_1.default.compare(password, auth.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }
    if (auth && (yield bcryptjs_1.default.compare(password, auth.password))) {
        const accessToken = jsonwebtoken_1.default.sign({
            id: auth._id,
            role: auth.role
        }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '20S' });
        const refreshToken = jsonwebtoken_1.default.sign({
            id: auth._id,
            role: auth.role
        }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '365d' });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: {
                email: auth.email,
                role: auth.role,
                accessToken: accessToken,
            }
        });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
        if (err) {
            console.log(err);
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '20s' });
        const newRefreshToken = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role
        }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '365d' });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.status(200).json({
            status: 'success',
            message: 'User refresh token successfully',
            data: {
                accessToken: accessToken,
            }
        });
    });
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('refreshToken');
    res.status(200).json({
        status: 'success',
        message: 'User logged out successfully',
    });
    return;
});
exports.logout = logout;
