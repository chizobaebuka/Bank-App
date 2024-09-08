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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_enum_1 = require("../interfaces/enum/user-enum");
const index_utils_1 = __importDefault(require("../utils/index.utils"));
const code_enum_1 = require("../interfaces/enum/code-enum");
const email_service_1 = __importDefault(require("../services/email-service"));
const moment_1 = __importDefault(require("moment"));
const payment_service_1 = __importDefault(require("../services/payment-service"));
class UserController {
    constructor(_userService, _tokenService) {
        this.userService = _userService;
        this.tokenService = _tokenService;
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const newUser = {
                    firstname: params.firstname,
                    lastname: params.lastname,
                    email: params.email,
                    username: params.email.split("@")[0],
                    password: params.password,
                    role: user_enum_1.UserRoles.CUSTOMER,
                    isEmailVerified: user_enum_1.EmailStatus.NOT_VERIFIED,
                    accountStatus: user_enum_1.AccountStatus.ACTIVE,
                };
                newUser.password = bcryptjs_1.default.hashSync(newUser.password, 10);
                const userExists = yield this.userService.getUserByField({ email: newUser.email });
                if (userExists) {
                    return index_utils_1.default.handleError(res, "Email Already Exists", code_enum_1.ResponseCode.ALREADY_EXIST);
                }
                const user = yield this.userService.createUser(newUser);
                user.password = "";
                return index_utils_1.default.handleSuccess(res, "User Registered Successfully", { user }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                res.status(500).json({ status: false, message: e.message });
            }
        });
    }
    createPaystackCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const paystackCustomer = yield payment_service_1.default.createPaystackCustomer(params.email, params.firstname, params.lastname, params.phone);
                if (!paystackCustomer) {
                    return index_utils_1.default.handleError(res, "Failed to create Paystack customer", code_enum_1.ResponseCode.SERVER_ERROR);
                }
                return index_utils_1.default.handleSuccess(res, "Paystack Customer Created Successfully", { paystackCustomer }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                res.status(500).json({ status: false, message: e.message });
            }
        });
    }
    createDedicatedVirtualPaystackAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const virtualAccount = yield payment_service_1.default.generateDedicatedVirtualAccountNumber(params.customerId, params.preferredBank);
                if (!virtualAccount) {
                    return index_utils_1.default.handleError(res, "Failed to create virtual account", code_enum_1.ResponseCode.SERVER_ERROR);
                }
                return index_utils_1.default.handleSuccess(res, "Virtual Account Created Successfully", { virtualAccount }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                res.status(500).json({ status: false, message: e.message });
            }
        });
    }
    assignDedicatedVirtualAccountNumber(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const virtualAccount = yield payment_service_1.default.assignDedicatedVirtualAccount(params.email, params.firstName, params.lastName, params.phone, params.preferredBank, params.country);
                if (!virtualAccount) {
                    return index_utils_1.default.handleError(res, "Failed to assign virtual account", code_enum_1.ResponseCode.SERVER_ERROR);
                }
                return index_utils_1.default.handleSuccess(res, "Virtual Account Assigned Successfully", { virtualAccount }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                res.status(500).json({ status: false, message: e.message });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const user = yield this.userService.getUserByField({ email: params.email });
                if (!user) {
                    return index_utils_1.default.handleError(res, "Invalid Login Credentials", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const isValidPassword = yield bcryptjs_1.default.compare(params.password, user.password);
                if (!isValidPassword) {
                    return index_utils_1.default.handleError(res, "Invalid Login Credentials", code_enum_1.ResponseCode.INVALID_DATA);
                }
                const token = jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    role: user.role,
                }, process.env.JWT_KEY, { expiresIn: "1h" });
                return index_utils_1.default.handleSuccess(res, "Login Successful", { user, token }, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (err) {
                return index_utils_1.default.handleError(res, err.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = Object.assign({}, req.body);
                const user = yield this.userService.getUserByField({ email: params.email });
                if (!user) {
                    return index_utils_1.default.handleError(res, "Account Does Not Exist", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const token = yield this.tokenService.createForgotPasswordToken(params.email);
                yield email_service_1.default.sendForgotPasswordMail(params.email, token.code);
                return index_utils_1.default.handleSuccess(res, "Password Reset Code Sent to Email", {}, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, code, password } = req.body;
                const params = { email, code, password };
                let isValidToken = yield this.tokenService.getTokenByField({ key: params.email, code: params.code, type: this.tokenService.TokenTypes.FORGOT_PASSWORD, status: this.tokenService.TokenStatus.NOT_USED });
                if (!isValidToken) {
                    return index_utils_1.default.handleError(res, "Token has expired", code_enum_1.ResponseCode.NOT_FOUND);
                }
                if (isValidToken && (0, moment_1.default)(isValidToken.expires).diff((0, moment_1.default)(), 'minutes') <= 0) {
                    return index_utils_1.default.handleError(res, "Token has expired", code_enum_1.ResponseCode.NOT_FOUND);
                }
                let user = yield this.userService.getUserByField({ email: params.email });
                if (!user) {
                    return index_utils_1.default.handleError(res, "User Does Not Exist", code_enum_1.ResponseCode.NOT_FOUND);
                }
                const _password = bcryptjs_1.default.hashSync(params.password, 10);
                yield this.userService.updateRecord({ id: user.id }, { password: _password });
                yield this.tokenService.updateRecord({ id: isValidToken.id }, { status: this.tokenService.TokenStatus.USED });
                return index_utils_1.default.handleSuccess(res, "Password Reset Successful", {}, code_enum_1.ResponseCode.SUCCESS);
            }
            catch (e) {
                return index_utils_1.default.handleError(res, e.message, code_enum_1.ResponseCode.SERVER_ERROR);
            }
        });
    }
}
exports.default = UserController;
