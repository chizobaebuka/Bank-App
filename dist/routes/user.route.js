"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user-controller"));
const user_service_1 = __importDefault(require("../services/user-service"));
const index_middleware_1 = require("../middlewares/index.middleware");
const user_validator_schema_1 = __importDefault(require("../validators/user-validator.schema"));
const user_datasource_1 = __importDefault(require("../datasources/user-datasource"));
const token_service_1 = __importDefault(require("../services/token-service"));
const token_datasource_1 = __importDefault(require("../datasources/token-datasource"));
const router = express_1.default.Router();
const tokenService = new token_service_1.default(new token_datasource_1.default());
const userDataSource = new user_datasource_1.default();
exports.userService = new user_service_1.default(userDataSource);
const userController = new user_controller_1.default(exports.userService, tokenService);
const createUserRoute = () => {
    router.post('/register', (0, index_middleware_1.validator)(user_validator_schema_1.default.registerSchema), (req, res) => {
        return userController.registerUser(req, res);
    });
    router.post('/login', (0, index_middleware_1.validator)(user_validator_schema_1.default.loginSchema), (req, res) => {
        return userController.loginUser(req, res);
    });
    router.post('/forgot-password', (0, index_middleware_1.validator)(user_validator_schema_1.default.forgotPasswordSchema), (req, res) => {
        return userController.forgotPassword(req, res);
    });
    router.post('/reset-password', (0, index_middleware_1.validator)(user_validator_schema_1.default.resetPasswordSchema), (req, res) => {
        return userController.resetPassword(req, res);
    });
    return router;
};
exports.default = createUserRoute();
