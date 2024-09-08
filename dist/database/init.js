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
const account_model_1 = __importDefault(require("../models/account-model"));
const payee_model_1 = __importDefault(require("../models/payee-model"));
const token_model_1 = __importDefault(require("../models/token-model"));
const transaction_model_1 = __importDefault(require("../models/transaction-model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const index_1 = __importDefault(require("./index"));
const DbInitialize = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield index_1.default.authenticate();
        user_model_1.default.sync({ alter: true });
        token_model_1.default.sync({ alter: false });
        account_model_1.default.sync({ alter: true });
        transaction_model_1.default.sync({ alter: false });
        payee_model_1.default.sync({ alter: false });
    }
    catch (err) {
        console.log("Unable to connect to the database", err);
    }
});
exports.default = DbInitialize;
