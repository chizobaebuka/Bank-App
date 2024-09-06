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
class AccountController {
    constructor(_accountService) {
        this.accountService = _accountService;
    }
    createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const newAccount = {
                    userId: params.user.id,
                    type: params.type,
                };
                const account = yield this.accountService.createAccount(newAccount);
                if (!account) {
                    return index_utils_1.default.handleError(res, "Failed to create account", code_enum_1.ResponseCode.SERVER_ERROR);
                }
                return index_utils_1.default.handleSuccess(res, "Account Created Successfully", { account }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    getAllUserAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const accounts = yield this.accountService.getAccountsByUserId(params.user.id);
                return index_utils_1.default.handleSuccess(res, "Account fetched successfully", { accounts }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    getUserAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.params);
                const accounts = yield this.accountService.getAccountByField({ id: index_utils_1.default.escapeHtml(params.id) });
                if (!accounts) {
                    return index_utils_1.default.handleError(res, "Account not found", code_enum_1.ResponseCode.NOT_FOUND);
                }
                return index_utils_1.default.handleSuccess(res, "Account fetched successfully", { accounts }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
}
exports.default = AccountController;
