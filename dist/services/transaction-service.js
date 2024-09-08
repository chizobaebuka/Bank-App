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
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_enum_1 = require("../interfaces/enum/transaction-enum");
const uuid_1 = require("uuid");
class TransactionService {
    constructor(_transactionDataSource) {
        this.transactionDataSource = _transactionDataSource;
    }
    depositByPaystack(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const deposit = Object.assign(Object.assign({}, data), { type: transaction_enum_1.TransactionTypes.DEPOSIT, detail: Object.assign(Object.assign({}, data.detail), { gateway: transaction_enum_1.TransactionGateWay.PAYSTACK }), status: "IN_PROGRESS" });
            return this.transactionDataSource.create(deposit);
        });
    }
    fetchTransactionByReference(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                where: { reference },
                raw: true,
            };
            return this.transactionDataSource.fetchOne(query);
        });
    }
    generatePaymentReference() {
        return (0, uuid_1.v4)();
    }
    setStatus(transactionId_1, status_1) {
        return __awaiter(this, arguments, void 0, function* (transactionId, status, options = {}) {
            const filter = Object.assign({ where: { id: transactionId } }, options);
            const update = {
                status
            };
            yield this.transactionDataSource.updateOne(filter, update);
        });
    }
    processInternalTransfer(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            const record = Object.assign(Object.assign({}, data), { type: transaction_enum_1.TransactionTypes.TRANSFER, reference: this.generatePaymentReference(), detail: Object.assign(Object.assign({}, data.detail), { gateway: transaction_enum_1.TransactionGateWay.NONE }), status: transaction_enum_1.TransactionStatus.COMPLETED });
            return this.transactionDataSource.create(record, options);
        });
    }
    processExternalTransfer(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            const record = Object.assign(Object.assign({}, data), { type: transaction_enum_1.TransactionTypes.TRANSFER, detail: Object.assign({}, data.detail), status: transaction_enum_1.TransactionStatus.IN_PROGRESS });
            return this.transactionDataSource.create(record, options);
        });
    }
}
exports.default = TransactionService;
