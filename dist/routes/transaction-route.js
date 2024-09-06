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
const router = express_1.default.Router();
const transactionService = new transaction_service_1.default(new transaction_datasource_1.default());
const transactionController = new transaction_controller_1.default(transactionService);
const createTransactionRoute = () => {
    router.post('/initiate-paystack-deposit', (0, index_middleware_1.validator)(transaction_validator_schema_1.default.initiatePaystackDepositSchema), (0, index_middleware_1.Auth)(), (req, res) => {
        return transactionController.initiatePaystackDeposit(req, res);
    });
    return router;
};
exports.default = createTransactionRoute();
