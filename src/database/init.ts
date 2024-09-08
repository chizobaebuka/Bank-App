import AccountModel from '../models/account-model';
import PayeeModel from '../models/payee-model';
import TokenModel from '../models/token-model';
import TransactionModel from '../models/transaction-model';
import UserModel from '../models/user.model';
import Db from './index';

const DbInitialize = async () => {
    try {
        await Db.authenticate();
        UserModel.sync({ alter: true });
        TokenModel.sync({ alter: false });
        AccountModel.sync({ alter: true });
        TransactionModel.sync({ alter: false });
        PayeeModel.sync({ alter: false });
    } catch (err) {
        console.log("Unable to connect to the database", err);
    }
}

export default DbInitialize;