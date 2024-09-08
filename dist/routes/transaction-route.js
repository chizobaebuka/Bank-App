"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_middleware_1 = require("../middlewares/index.middleware");
const transaction_controller_1 = __importDefault(require("../controllers/transaction-controller"));
const transaction_service_1 = __importDefault(require("../services/transaction-service"));
const transaction_datasource_1 = __importDefault(require("../datasources/transaction-datasource"));
const transaction_validator_schema_1 = __importDefault(require("../validators/transaction-validator.schema"));
const account_service_1 = __importDefault(require("../services/account-service"));
const account_datasource_1 = __importDefault(require("../datasources/account-datasource"));
const payee_service_1 = __importDefault(require("../services/payee-service"));
const payee_datasource_1 = __importDefault(require("../datasources/payee-datasource"));
const router = express_1.default.Router();
const payeeService = new payee_service_1.default(new payee_datasource_1.default());
const accountService = new account_service_1.default(new account_datasource_1.default());
const transactionService = new transaction_service_1.default(new transaction_datasource_1.default());
const transactionController = new transaction_controller_1.default(transactionService, accountService, payeeService);
const createTransactionRoute = () => {
    router.post('/initiate-paystack-deposit', (0, index_middleware_1.validator)(transaction_validator_schema_1.default.initiatePaystackDepositSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return transactionController.initiatePaystackDeposit(req, res);
    });
    router.post('/verify-paystack-transaction', (0, index_middleware_1.validator)(transaction_validator_schema_1.default.verifyPaystackTransactionSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return transactionController.verifyPaystackDeposit(req, res);
    });
    router.post('/make-transfer', (0, index_middleware_1.validator)(transaction_validator_schema_1.default.makeInternalTransferSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return transactionController.internalTransfer(req, res);
    });
    router.post('/make-withdrawal-by-paystack', (0, index_middleware_1.validator)(transaction_validator_schema_1.default.makeWithdrawalByPaystackSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return transactionController.withdrawByPaystack(req, res);
    });
    router.get('/fetch-paystack-banks', (0, index_middleware_1.validator)(transaction_validator_schema_1.default.fetchPaystackBanksSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return transactionController.fetchBanksFromPaystack(req, res);
    });
    return router;
};
exports.default = createTransactionRoute();
