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
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
class PaymentService {
    static generatePaystackReference() {
        return (0, uuid_1.v4)();
    }
    static generatePaystackPaymentUrl(email, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const amountInKobo = amount * 100; // Convert amount to kobo
                const params = {
                    email,
                    amount: amountInKobo,
                    channels: ["card"], // Make sure Paystack account supports the channels
                    callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`, // Ensure this URL is reachable and correct
                    reference: this.generatePaystackReference(),
                };
                const config = {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Ensure secret key is correct
                        'Content-Type': 'application/json',
                    }
                };
                const response = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", params, config);
                if (response.data && response.data.status) {
                    return response.data.data; // Return the payment object if successful
                }
                console.error('Paystack response status was false:', response.data); // Log Paystack response if status is false
                return null;
            }
            catch (err) {
                console.error('Error initializing Paystack transaction:', err); // Log the error for better debugging
                return null;
            }
        });
    }
    static verifyPaystackPayment(reference, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    }
                };
                const { data } = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, config);
                console.log('Paystack verification response:', data);
                if (data && data.status) {
                    const { amount: amountInKobo } = data.data;
                    if (amountInKobo !== (amount * 100)) {
                        return false;
                    }
                    return true;
                }
            }
            catch (err) {
                return false;
            }
            return false;
        });
    }
}
exports.default = PaymentService;
