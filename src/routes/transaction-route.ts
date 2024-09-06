import express, { Request, Response } from 'express';
import { Auth, validator } from '../middlewares/index.middleware';
import TransactionController from '../controllers/transaction-controller';
import TransactionService from '../services/transaction-service';
import TransactionDataSource from '../datasources/transaction-datasource';
import validationSchema from '../validators/transaction-validator.schema';
import AccountService from '../services/account-service';
import AccountDataSource from '../datasources/account-datasource';

const router = express.Router();
const accountService = new AccountService(new AccountDataSource());
const transactionService = new TransactionService(new TransactionDataSource());
const transactionController = new TransactionController(transactionService, accountService);

const createTransactionRoute = () => {

    router.post('/initiate-paystack-deposit', validator(validationSchema.initiatePaystackDepositSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.initiatePaystackDeposit(req, res);
    })

    router.post('/verify-paystack-transaction', validator(validationSchema.verifyPaystackTransactionSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.verifyPaystackDeposit(req, res);
    })

    return router;
}

export default createTransactionRoute();