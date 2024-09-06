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
    constructor(_transactionService, _accountService) {
        this.transactionService = _transactionService;
        this.accountService = _accountService;
    }
    deposit(accountId, transactionId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield database_1.default.transaction();
            try {
                yield this.accountService.topUpBalance(accountId, amount, { transaction: tx });
                yield this.transactionService.setStatus(transactionId, transaction_enum_1.TransactionStatus.COMPLETED, { transaction: tx });
                yield tx.commit();
                return true;
            }
            catch (err) {
                yield tx.rollback();
                return false;
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
    verifyPaystackTransactionByRef(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const transaction = yield this.transactionService.fetchTransactionByReference(params.reference);
                if (!transaction) {
                    return index_utils_1.default.handleError(res, "Invalid Transaction Reference", code_enum_1.ResponseCode.NOT_FOUND);
                }
                if (transaction.status != transaction_enum_1.TransactionStatus.IN_PROGRESS) {
                    return index_utils_1.default.handleError(res, "Transaction status not supported", code_enum_1.ResponseCode.BAD_REQUEST);
                }
                const isValidPaymentTx = yield payment_service_1.default.verifyPaystackPayment(params.reference, transaction.amount);
                if (!isValidPaymentTx) {
                    return index_utils_1.default.handleError(res, "Invalid Transaction Reference", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const deposit = yield this.deposit(transaction.accountId, transaction.id, transaction.amount);
                if (!deposit) {
                    return index_utils_1.default.handleError(res, "Deposit Failed", code_enum_1.ResponseCode.SERVER_ERROR);
                }
                return index_utils_1.default.handleSuccess(res, "Deposit Completed Successfully", { transaction: deposit }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
}
exports.default = TransactionController;
