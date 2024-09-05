import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/email.html'), 'utf8');

dotenv.config();

class EmailService {
    constructor() {}

    static async sendForgotPasswordMail(to: string, code: string) {
        const subject = "Forgot Password";
        const message = `Your email reset code is <b>${code}</b>`;
        return this.sendMail(to, subject, message);
    }

    private static replaceEmailTemplateConstants(template: string, key: string, data: string) {
        const regex = new RegExp(key, 'g');
        return template.replace(regex, data);
    }

    private static async sendMail(to: string, subject: string, message: string) {
        const appName = process.env.APP_NAME as string;
        const supportMail = process.env.SUPPORT_MAIL as string;
        const name = to.split('@')[0];

        let html = this.replaceEmailTemplateConstants(emailTemplate, '#APP_NAME#', appName);
        html = this.replaceEmailTemplateConstants(html, '#NAME#', name);
        html = this.replaceEmailTemplateConstants(html, '#MESSAGE#', message);
        html = this.replaceEmailTemplateConstants(html, '#SUPPORT_MAIL#', supportMail);

        const transport = nodemailer.createTransport({
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
        }

        const infoMail = await transport.sendMail(mailOptions);
        return infoMail;
    }
}

export default EmailService;