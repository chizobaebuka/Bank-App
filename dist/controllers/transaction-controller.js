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
const index_utils_1 = __importDefault(require("../utils/index.utils"));
const code_enum_1 = require("../interfaces/enum/code-enum");
const payment_service_1 = __importDefault(require("../services/payment-service"));
const transaction_enum_1 = require("../interfaces/enum/transaction-enum");
const database_1 = __importDefault(require("../database"));
class TransactionController {
    constructor(_transactionService, _accountService, _payeeService) {
        this.transactionService = _transactionService;
        this.accountService = _accountService;
        this.payeeService = _payeeService;
    }
    deposit(accountId, transactionId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield database_1.default.transaction();
            try {
                // Top up account balance
                yield this.accountService.topUpBalance(accountId, amount, { transaction: tx });
                // Update transaction status to COMPLETED
                yield this.transactionService.setStatus(transactionId, "COMPLETED", { transaction: tx });
                yield tx.commit(); // Commit transaction
                return true;
            }
            catch (err) {
                yield tx.rollback(); // Rollback on error
                return false;
            }
        });
    }
    transfer(senderAccount, receiverAccount, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield database_1.default.transaction();
            try {
                yield this.accountService.topUpBalance(senderAccount.id, -amount, { transaction: tx });
                yield this.accountService.topUpBalance(receiverAccount.id, amount, { transaction: tx });
                const newTransaction = {
                    userId: senderAccount.userId,
                    accountId: senderAccount.id,
                    amount,
                    detail: {
                        receiverAccountNumber: receiverAccount.accountNumber,
                    },
                };
                let transfer = yield this.transactionService.processInternalTransfer(newTransaction, { transaction: tx });
                yield tx.commit(); // Commit transaction
                return {
                    status: true,
                    transaction: transfer
                };
            }
            catch (err) {
                yield tx.rollback(); // Rollback on error
                return {
                    status: false,
                    transaction: null
                };
            }
        });
    }
    initiatePaystackDeposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const depositInfo = yield payment_service_1.default.generatePaystackPaymentUrl(params.user.email, params.amount);
                if (!depositInfo) {
                    return index_utils_1.default.handleError(res, "Paystack payment not available, try again in few seconds", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const newTransaction = {
                    userId: params.user.id,
                    accountId: params.accountId,
                    amount: params.amount,
                    reference: depositInfo.reference,
                    detail: {},
                };
                let deposit = yield this.transactionService.depositByPaystack(newTransaction);
                return index_utils_1.default.handleSuccess(res, "Transaction Created Successfully", { transaction: deposit, url: depositInfo.authorization_url }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    verifyPaystackDeposit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                let transaction = yield this.transactionService.fetchTransactionByReference(params.reference);
                if (!transaction) {
                    return index_utils_1.default.handleError(res, "Invalid transaction reference", code_enum_1.ResponseCode.NOT_FOUND);
                }
                console.log({ tra: transaction.status });
                if (transaction.status !== "IN_PROGRESS") {
                    return index_utils_1.default.handleError(res, "Transaction status not supported", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const isValidPaymentTx = yield payment_service_1.default.verifyPaystackPayment(params.reference, transaction.amount);
                console.log('Paystack transaction verification result:', isValidPaymentTx);
                if (!isValidPaymentTx) {
                    return index_utils_1.default.handleError(res, "Invalid transaction reference", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const deposit = yield this.deposit(transaction.accountId, transaction.id, transaction.amount);
                if (!deposit) {
                    return index_utils_1.default.handleError(res, "Deposit failed", code_enum_1.ResponseCode.NOT_FOUND);
                }
                return index_utils_1.default.handleSuccess(res, "Deposit was completed successfully", { transaction }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (error) {
                console.error('Error during Paystack deposit verification:', error);
                return index_utils_1.default.handleError(res, error.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    internalTransfer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const senderAccount = yield this.accountService.getAccountByField({ id: params.senderAccountId });
                if (!senderAccount) {
                    return index_utils_1.default.handleError(res, "Sender account not found", code_enum_1.ResponseCode.NOT_FOUND);
                }
                if (senderAccount.balance < params.amount) {
                    return index_utils_1.default.handleError(res, "Insufficient balance", code_enum_1.ResponseCode.BAD_REQUEST);
                }
                if (params.amount <= 0) {
                    return index_utils_1.default.handleError(res, "Amount must be greater than zero", code_enum_1.ResponseCode.BAD_REQUEST);
                }
                const receiverAccount = yield this.accountService.getAccountByField({ accountNumber: params.receiverAccountNumber });
                if (!receiverAccount) {
                    return index_utils_1.default.handleError(res, "Receiver account not found", code_enum_1.ResponseCode.NOT_FOUND);
                }
                if (senderAccount.userId === receiverAccount.userId) {
                    return index_utils_1.default.handleError(res, "You can't transfer to yourself", code_enum_1.ResponseCode.BAD_REQUEST);
                }
                const result = yield this.transfer(senderAccount, receiverAccount, params.amount);
                if (!result.status) {
                    return index_utils_1.default.handleError(res, "Transfer failed", code_enum_1.ResponseCode.NOT_FOUND);
                }
                return index_utils_1.default.handleSuccess(res, "Transfer completed successfully", { transaction: result.transaction }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (error) {
                return index_utils_1.default.handleError(res, error.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    fetchBanksFromPaystack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const banks = yield payment_service_1.default.fetchBanks();
                return index_utils_1.default.handleSuccess(res, "Banks fetched successfully", { banks }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (error) {
                return index_utils_1.default.handleError(res, error.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    withdrawByPaystack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const senderAccount = yield this.accountService.getAccountByField({ id: params.senderAccountId });
                if (!senderAccount) {
                    return index_utils_1.default.handleError(res, "Sender account not found", code_enum_1.ResponseCode.NOT_FOUND);
                }
                console.log({ senderAccount });
                if (senderAccount.balance < params.amount) {
                    return index_utils_1.default.handleError(res, "Insufficient balance", code_enum_1.ResponseCode.BAD_REQUEST);
                }
                if (params.amount <= 0) {
                    return index_utils_1.default.handleError(res, "Amount must be greater than zero", code_enum_1.ResponseCode.BAD_REQUEST);
                }
                let payeeRecord = yield this.payeeService.fetchPayeeByAccountNumberAndBank(params.receiverAccountNumber, params.bankCode);
                console.log({ payeeRecord });
                let recepientId = "";
                if (!payeeRecord) {
                    const isValidAccount = yield payment_service_1.default.verifyAccountNumber(params.receiverAccountNumber, params.bankCode);
                    console.log({ isValidAccount });
                    if (!isValidAccount) {
                        return index_utils_1.default.handleError(res, "Invalid account details, please verify the account number and bank code.", code_enum_1.ResponseCode.BAD_REQUEST);
                    }
                    const paystackPayeeRecord = {
                        accountNumber: params.receiverAccountNumber,
                        accountName: params.receiverAccountName,
                        bankCode: params.bankCode,
                    };
                    recepientId = (yield payment_service_1.default.createPaystackRecipient(paystackPayeeRecord));
                    console.log({ recepientId });
                    if (recepientId) {
                        payeeRecord = yield this.payeeService.savePayeeRecord({
                            userId: params.userId,
                            accountNumber: params.receiverAccountNumber,
                            accountName: params.receiverAccountName,
                            bankCode: params.bankCode,
                            detail: {
                                paystackRecipientId: recepientId,
                            },
                        });
                    }
                    else {
                        return index_utils_1.default.handleError(res, "Invalid Payment Account please try another payout method", code_enum_1.ResponseCode.NOT_FOUND);
                    }
                }
                else {
                    recepientId = payeeRecord.detail.paystackRecipientId;
                }
                const transferData = yield payment_service_1.default.initiatePaystackTransfer(recepientId, params.amount, params.message);
                if (!transferData) {
                    return index_utils_1.default.handleError(res, "Paystack transfer failed", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const result = yield this.transferToExternalAccount(senderAccount, params.receiverAccountNumber, transferData.reference, params.amount);
                if (!result.status) {
                    return index_utils_1.default.handleError(res, "Failed to transfer to external account", code_enum_1.ResponseCode.NOT_FOUND);
                }
                return index_utils_1.default.handleSuccess(res, "Transfer initialized successfully", { transaction: result.transaction }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (error) {
                return index_utils_1.default.handleError(res, error.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    transferToExternalAccount(senderAccount, receiverAccount, reference, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield database_1.default.transaction();
            try {
                yield this.accountService.topUpBalance(senderAccount.id, -amount, { transaction: tx });
                const newTransaction = {
                    userId: senderAccount.userId,
                    reference,
                    accountId: senderAccount.id,
                    amount,
                    detail: {
                        receiverAccountNumber: receiverAccount.accountNumber,
                        gateway: transaction_enum_1.TransactionGateWay.PAYSTACK
                    },
                };
                let transfer = yield this.transactionService.processExternalTransfer(newTransaction, { transaction: tx });
                yield tx.commit(); // Commit transaction
                return {
                    status: true,
                    transaction: transfer
                };
            }
            catch (err) {
                yield tx.rollback(); // Rollback on error
                return {
                    status: false,
                    transaction: null
                };
            }
        });
    }
}
exports.default = TransactionController;
