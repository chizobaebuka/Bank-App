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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
class PaymentService {
    static generatePaystackReference() {
        return (0, uuid_1.v4)();
    }
    static createPaystackCustomer(email, firstName, lastName, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone, // Include the country code (e.g. +234) before the phone number
                };
                const { data } = yield axios_1.default.post(`https://api.paystack.co/customer`, params, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Paystack creation customer:', data);
                // Verify that the amount matches
                if (data && data.status) {
                    const customerData = {
                        email: data.data.email,
                        integration: data.data.integration,
                        domain: data.data.domain,
                        customer_code: data.data.customer_code,
                        id: data.data.id,
                        identified: data.data.identified,
                        identifications: data.data.identifications,
                        createdAt: new Date(data.data.createdAt),
                        updatedAt: new Date(data.data.updatedAt),
                    };
                    return customerData;
                }
                return null;
            }
            catch (err) {
                return null;
            }
        });
    }
    static generateDedicatedVirtualAccountNumber(customerId, preferredBank) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const params = {
                    customer: customerId, // Use customer id returned from createPaystackCustomer
                    preferred_bank: preferredBank, // Wema Bank as default
                };
                const { data } = yield axios_1.default.post(`https://api.paystack.co/dedicated_account`, params, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Paystack virtual account creation:', data);
                if (data && data.status) {
                    return data; // 
                }
                return null;
            }
            catch (err) {
                console.error('Error creating Paystack virtual account:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                return null;
            }
        });
    }
    static accountNumberFromPaystack(customerCode, preferredBank) {
        return __awaiter(this, void 0, void 0, function* () {
            const virtualAccountData = yield PaymentService.generateDedicatedVirtualAccountNumber(customerCode, preferredBank);
            if (virtualAccountData && virtualAccountData.data) {
                return virtualAccountData.data.account_number;
            }
            return null;
        });
    }
    static assignDedicatedVirtualAccount(email_1, firstName_1, lastName_1, phone_1) {
        return __awaiter(this, arguments, void 0, function* (email, firstName, lastName, phone, preferredBank = 'wema-bank', country = 'NG') {
            var _a;
            try {
                const params = {
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    preferred_bank: preferredBank,
                    country
                };
                const { data } = yield axios_1.default.post(`https://api.paystack.co/dedicated_account/assign`, params, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Assigning dedicated virtual account:', data);
                if (data && data.status) {
                    return data;
                }
                return null;
            }
            catch (err) {
                console.error('Error assigning Paystack virtual account:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                return null;
            }
        });
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
                    },
                };
                const { data } = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, config);
                console.log('Paystack verification response:', data);
                // Verify that the amount matches
                if (data && data.status) {
                    const { amount: amountInKobo } = data.data;
                    if (amountInKobo !== (amount * 100)) {
                        return false; // Amount mismatch
                    }
                    return true; // Payment is verified
                }
                return false; // Payment verification failed
            }
            catch (err) {
                return false; // Error occurred during verification
            }
        });
    }
    static fetchBanks() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Fetch the list of banks from Paystack
                const response = yield axios_1.default.get('https://api.paystack.co/bank', {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                const banksData = response.data.data;
                // Extracting bank codes
                const BANKCODES = banksData.map(bank => bank.code);
                console.log('Formatted BANKS:', banksData);
                console.log('Formatted BANKCODES:', BANKCODES);
                // Define the path to the enum.ts file
                const filePath = path_1.default.join(__dirname, '../interfaces/enum/bank-enum.ts');
                // Prepare the content to be written to the file
                const content = `
                // src/interfaces/enum/bank-enum.ts
    
                export const BANKS = ${JSON.stringify(banksData, null, 2)} as const;
    
                export const BANK_CODES = ${JSON.stringify(BANKCODES, null, 2)} as const;
            `;
                // Write the content to the file
                fs_1.default.writeFileSync(filePath, content);
                // Return the formatted data
                return { Banks: banksData, BankCodes: BANKCODES };
            }
            catch (error) {
                console.error('Error fetching banks from Paystack:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                return { Banks: [], BankCodes: [] };
            }
        });
    }
    static verifyAccountNumber(accountNumber, bankCode) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Fetch the list of valid bank codes from Paystack
                const banksResponse = yield axios_1.default.get(`https://api.paystack.co/bank`, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                const validBanks = banksResponse.data.data;
                const isValidBankCode = validBanks.some((bank) => bank.code === bankCode);
                // Validate bank code
                if (!isValidBankCode) {
                    console.error('Invalid bank code provided. Please use the correct bank code.');
                    return false;
                }
                // Proceed to validate the account number
                const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
                const config = {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                };
                const response = yield axios_1.default.get(url, config);
                const data = response.data;
                console.log('Paystack account validation response:', data);
                // Check if Paystack returns a successful status
                if (data.status) {
                    console.log(`Account verified: ${data.data.account_name} (${data.data.account_number})`);
                    return true; // Account is valid
                }
                console.error('Account validation failed:', data.message);
                return false; // Account validation failed
            }
            catch (err) {
                console.error('Error validating account:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
                return false; // Error occurred during validation
            }
        });
    }
    static createPaystackRecipient(userRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    type: "nuban",
                    name: userRecord.accountName,
                    account_number: userRecord.accountNumber,
                    bank_code: userRecord.bankCode,
                    currency: "NGN",
                };
                const { data } = yield axios_1.default.post(`https://api.paystack.co/transferrecipient`, params, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('Paystack creation recepient:', data);
                // Verify that the amount matches
                if (data && data.status) {
                    return data.data.recipient_code;
                }
                return null;
            }
            catch (err) {
                return null;
            }
        });
    }
    static initiatePaystackTransfer(recepient, amount, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    source: "balance",
                    reason: message,
                    amount: amount * 100, // Convert amount to kobo
                    recipient: recepient,
                    reference: this.generatePaystackReference(),
                    currency: "NGN",
                };
                const record = yield axios_1.default.post(`https://api.paystack.co/transfer`, params, {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });
                const { data } = record;
                console.log('Paystack creation recepient:', data);
                // Verify that the amount matches
                if (data && data.status) {
                    return {
                        reference: params.reference,
                        transferCode: data.data.transfer_code,
                    };
                }
                return null;
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
    }
}
exports.default = PaymentService;
