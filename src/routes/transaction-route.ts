import express, { Request, Response } from 'express';
import { Auth, validator } from '../middlewares/index.middleware';
import TransactionController from '../controllers/transaction-controller';
import TransactionService from '../services/transaction-service';
import TransactionDataSource from '../datasources/transaction-datasource';
import validationSchema from '../validators/transaction-validator.schema';
import AccountService from '../services/account-service';
import AccountDataSource from '../datasources/account-datasource';
import PayeeService from '../services/payee-service';
import PayeeDataSource from '../datasources/payee-datasource';

const router = express.Router();
const payeeService = new PayeeService(new PayeeDataSource());
const accountService = new AccountService(new AccountDataSource());
const transactionService = new TransactionService(new TransactionDataSource());
const transactionController = new TransactionController(transactionService, accountService, payeeService);

const createTransactionRoute = () => {

    router.post('/initiate-paystack-deposit', validator(validationSchema.initiatePaystackDepositSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.initiatePaystackDeposit(req, res);
    })

    router.post('/verify-paystack-transaction', validator(validationSchema.verifyPaystackTransactionSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.verifyPaystackDeposit(req, res);
    })

    router.post('/make-transfer', validator(validationSchema.makeInternalTransferSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.internalTransfer(req, res);
    });

    router.post('/make-withdrawal-by-paystack', validator(validationSchema.makeWithdrawalByPaystackSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.withdrawByPaystack(req, res);
    });

    router.get('/fetch-paystack-banks', validator(validationSchema.fetchPaystackBanksSchema), Auth(), (req: Request, res: Response) => {
        return transactionController.fetchBanksFromPaystack(req, res);
    })

    return router;
}

export default createTransactionRoute();