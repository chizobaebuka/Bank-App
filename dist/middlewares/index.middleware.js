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
exports.Auth = exports.validator = void 0;
const index_utils_1 = __importDefault(require("../utils/index.utils"));
const code_enum_1 = require("../interfaces/enum/code-enum");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_route_1 = require("../routes/user.route");
const validator = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validate(req.body, { abortEarly: false });
            return next();
        }
        catch (error) {
            return index_utils_1.default.handleError(res, error.errors.join(", "), code_enum_1.ResponseCode.BAD_REQUEST);
        }
    });
};
exports.validator = validator;
const Auth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let token = req.headers.authorization || "";
            if (index_utils_1.default.isEmpty(token)) {
                throw new TypeError("Unauthorized Access");
            }
            token = token.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
            if (decoded && decoded.id) {
                const user = yield user_route_1.userService.getUserByField({ id: decoded.id });
                if (!user) {
                    throw new TypeError("Unauthorized Access");
                }
                if (user.accountStatus === "DELETE") {
                    throw new TypeError("Unauthorized Access");
                }
                req.body.user = decoded;
                next();
            }
            else {
                throw new TypeError("Unauthorized Access");
            }
        }
        catch (error) {
            return index_utils_1.default.handleError(res, error.message, code_enum_1.ResponseCode.BAD_REQUEST);
        }
    });
};
exports.Auth = Auth;
