import { Sequelize, Dialect } from "sequelize";
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const database = String(process.env.DB_NAME);
const username = String(process.env.DB_USERNAME);
const password = String(process.env.DB_PASSWORD);
const dialect = (process.env.DB_DIALECT as Dialect) ?? "postgres";
const host = String(process.env.DB_HOST);
const port = +(process.env.DB_PORT ?? '5432'); 


const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect,
        port: port,
        logging: false,
    },
);

export default sequelize;