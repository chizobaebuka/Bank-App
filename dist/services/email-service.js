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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const emailTemplate = fs_1.default.readFileSync(path_1.default.join(__dirname, '../templates/email.html'), 'utf8');
dotenv_1.default.config();
class EmailService {
    constructor() { }
    static sendForgotPasswordMail(to, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const subject = "Forgot Password";
            const message = `Your email reset code is <b>${code}</b>`;
            return this.sendMail(to, subject, message);
        });
    }
    static replaceEmailTemplateConstants(template, key, data) {
        const regex = new RegExp(key, 'g');
        return template.replace(regex, data);
    }
    static sendMail(to, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const appName = process.env.APP_NAME;
            const supportMail = process.env.SUPPORT_MAIL;
            const name = to.split('@')[0];
            let html = this.replaceEmailTemplateConstants(emailTemplate, '#APP_NAME#', appName);
            html = this.replaceEmailTemplateConstants(html, '#NAME#', name);
            html = this.replaceEmailTemplateConstants(html, '#MESSAGE#', message);
            html = this.replaceEmailTemplateConstants(html, '#SUPPORT_MAIL#', supportMail);
            const transport = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.MAIL_USER,
                to,
                subject,
                text: message,
                html: html,
            };
            const infoMail = yield transport.sendMail(mailOptions);
            return infoMail;
        });
    }
}
exports.default = EmailService;
