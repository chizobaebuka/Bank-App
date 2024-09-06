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
                const amountInKobo = amount * 100;
                const params = {
                    email,
                    amount: amountInKobo,
                    channels: ["card"],
                    callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`,
                    reference: this.generatePaystackReference(),
                };
                const config = {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    }
                };
                const { data } = yield axios_1.default.post("https://api.paystack.co/transaction/initialize", params, config);
                if (data && data.status) {
                    return data.data;
                }
                return null;
            }
            catch (err) {
                return null;
            }
        });
    }
}
exports.default = PaymentService;
