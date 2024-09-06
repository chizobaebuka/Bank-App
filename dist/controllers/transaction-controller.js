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
class TransactionController {
    constructor(_transactionService) {
        this.transactionService = _transactionService;
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
                    reference: depositInfo.reference,
                    amount: params.amount,
                    detail: {},
                    type: "deposit",
                    status: "pending",
                };
                let deposit = yield this.transactionService.depositByPaystack(newTransaction);
                return index_utils_1.default.handleSuccess(res, "Transaction Created Successfully", { transaction: deposit, url: depositInfo.authorization_url }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
}
exports.default = TransactionController;
