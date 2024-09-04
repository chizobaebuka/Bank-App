import Db from './index';

const DbInitialize = async () => {
    try {
        await Db.authenticate();
    } catch (err) {
        console.log("Unable to connect to the database", err);
    }
}

export default DbInitialize;