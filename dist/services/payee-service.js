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
class PayeeService {
    constructor(_payeeDataSource) {
        this.payeeDataSource = _payeeDataSource;
    }
    fetchPayeeByAccountNumberAndBank(accountNumber, bankCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { where: { accountNumber, bankCode }, raw: true };
            return yield this.payeeDataSource.fetchOne(query);
        });
    }
    savePayeeRecord(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = Object.assign(Object.assign({}, data), { detail: Object.assign({}, data.detail) });
            return yield this.payeeDataSource.create(record);
        });
    }
}
exports.default = PayeeService;
