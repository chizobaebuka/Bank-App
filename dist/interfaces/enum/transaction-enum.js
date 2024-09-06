"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionGateWay = exports.TransactionTypes = void 0;
exports.TransactionTypes = {
    DEPOSIT: 'DEPOSIT',
    WITHDRAW: 'WITHDRAW',
    TRANSFER: 'TRANSFER',
};
exports.TransactionGateWay = {
    PAYSTACK: 'PAYSTACK',
    FLUTTERWAVE: 'FLUTTERWAVE',
    NONE: 'NONE',
};
exports.TransactionStatus = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};
