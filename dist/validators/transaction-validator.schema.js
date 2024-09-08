"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yup = __importStar(require("yup"));
const bank_enum_1 = require("../interfaces/enum/bank-enum");
const initiatePaystackDepositSchema = yup.object({
    amount: yup.number().required(),
    accountId: yup.string().trim().required(),
});
const verifyPaystackTransactionSchema = yup.object({
    reference: yup.string().trim().required(),
});
const makeInternalTransferSchema = yup.object({
    senderAccountId: yup.string().trim().required(),
    receiverAccountNumber: yup.string().trim().required(),
    amount: yup.number().required(),
});
const makeWithdrawalByPaystackSchema = yup.object({
    senderAccountId: yup.string().trim().required(),
    receiverAccountNumber: yup.string().trim().required(),
    receiverAccountName: yup.string().trim().required(),
    bankCode: yup.string().trim().required().oneOf(bank_enum_1.BANK_CODES),
    message: yup.string().trim().required(),
    amount: yup.number().required(),
});
const fetchPaystackBanksSchema = yup.object({
    // Add any required query parameters or headers here, e.g., authorization token
    // Assuming no additional validation is needed for fetching banks, this can be an empty object
    query: yup.object({}).noUnknown(true), // Adjust this if your endpoint requires specific query parameters
});
const validationSchema = {
    initiatePaystackDepositSchema,
    verifyPaystackTransactionSchema,
    makeInternalTransferSchema,
    makeWithdrawalByPaystackSchema,
    fetchPaystackBanksSchema,
};
exports.default = validationSchema;
