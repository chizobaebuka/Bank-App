"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_service_1 = __importDefault(require("../services/account-service"));
const account_datasource_1 = __importDefault(require("../datasources/account-datasource"));
const accounts_controller_1 = __importDefault(require("../controllers/accounts-controller"));
const index_middleware_1 = require("../middlewares/index.middleware");
const account_validator_schema_1 = __importDefault(require("../validators/account-validator.schema"));
const router = express_1.default.Router();
const accountService = new account_service_1.default(new account_datasource_1.default());
const accountController = new accounts_controller_1.default(accountService);
const createAccountRoute = () => {
    router.post('/create-account', (0, index_middleware_1.validator)(account_validator_schema_1.default.createAccountSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return accountController.createAccount(req, res);
    });
    router.get('/all-accounts', (0, index_middleware_1.Auth)(), (req, res) => {
        return accountController.getAllUserAccounts(req, res);
    });
    router.get('/account/:id', (0, index_middleware_1.Auth)(), (req, res) => {
        return accountController.getUserAccount(req, res);
    });
    return router;
};
exports.default = createAccountRoute();
