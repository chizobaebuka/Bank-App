import express, { Request, Response } from 'express';
import AccountService from '../services/account-service';
import AccountDataSource from '../datasources/account-datasource';
import AccountController from '../controllers/accounts-controller';
import { Auth, validator } from '../middlewares/index.middleware';
import validationSchema from '../validators/account-validator.schema';

const router = express.Router();
const accountService = new AccountService(new AccountDataSource());
const accountController = new AccountController(accountService);

const createAccountRoute = () => {

    router.post('/create-account', validator(validationSchema.createAccountSchema), Auth(), (req: Request, res: Response) => {
        return accountController.createAccount(req, res);
    })


    return router;
}

export default createAccountRoute();