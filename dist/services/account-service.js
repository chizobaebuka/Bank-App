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
const database_1 = __importDefault(require("../database"));
const account_enum_1 = require("../interfaces/enum/account-enum");
class AccountService {
    constructor(_accountDataSource) {
        this.accountDataSource = _accountDataSource;
    }
    generateAccountNumber() {
        let accountNumber = "";
        for (let i = 0; i < 10; i++) {
            accountNumber += Math.floor(Math.random() * 10);
        }
        return accountNumber;
    }
    createAccountNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            let accountNumber = "";
            let accountExist = false;
            while (!accountExist) {
                accountNumber = this.generateAccountNumber();
                const isAccountExist = yield this.accountDataSource.fetchOne({
                    where: { accountNumber },
                    returning: false,
                    raw: true
                });
                if (!isAccountExist) {
                    accountExist = true;
                    break;
                }
            }
            return accountNumber;
        });
    }
    createAccount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = Object.assign(Object.assign({}, data), { accountNumber: yield this.createAccountNumber(), status: account_enum_1.AccountStatus.ACTIVE, balance: 0.00 });
            return this.accountDataSource.create(record);
        });
    }
    getAccountsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                where: { userId },
                raw: true,
                returning: false
            };
            return this.accountDataSource.fetchAll(query);
        });
    }
    getAccountByField(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { where: Object.assign({}, record), raw: true };
            return this.accountDataSource.fetchOne(query);
        });
    }
    updateRecord(searchBy, record) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { where: Object.assign({}, searchBy) };
            return this.accountDataSource.updateOne(query, record);
        });
    }
    topUpBalance(accountId_1, amount_1) {
        return __awaiter(this, arguments, void 0, function* (accountId, amount, options = {}) {
            const filter = Object.assign({ where: { id: accountId } }, options);
            const update = {
                balance: database_1.default.literal('balance + ' + amount)
            };
            return yield this.accountDataSource.updateOne(filter, update);
        });
    }
}
exports.default = AccountService;
