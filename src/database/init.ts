import UserModel from '../models/user.model';
import Db from './index';

const DbInitialize = async () => {
    try {
        await Db.authenticate();
        UserModel.sync({ alter: false });
    } catch (err) {
        console.log("Unable to connect to the database", err);
    }
}

export default DbInitialize;