"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const createUserRoute = () => {
    const router = express_1.default.Router();
    router.post('/register', (req, res) => {
        console.log({ hhh: `hitting here` });
        res.json({ message: 'User created' });
    });
    router.post('/login', (req, res) => {
        res.json({ message: 'Login Successful!!' });
    });
    router.post('/forgot-password', (req, res) => {
        res.json({ message: 'Forgot Password mail sent' });
    });
    router.post('/reset-password', (req, res) => {
        res.json({ message: 'Rest Password successful' });
    });
    return router;
};
exports.default = createUserRoute();
