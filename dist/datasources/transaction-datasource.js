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
const transaction_model_1 = __importDefault(require("../models/transaction-model"));
class TransactionDataSource {
    fetchOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_model_1.default.findOne({ where: query.where });
        });
    }
    create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_model_1.default.create(data, Object.assign({ returning: true }, options));
        });
    }
    updateOne(searchBy, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield transaction_model_1.default.update(data, { where: searchBy.where });
        });
    }
    fetchAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_model_1.default.findAll({ where: query.where });
        });
    }
}
exports.default = TransactionDataSource;
