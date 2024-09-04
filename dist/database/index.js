"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database = String(process.env.DB_NAME);
const username = String(process.env.DB_USERNAME);
const password = String(process.env.DB_PASSWORD);
const dialect = (_a = process.env.DB_DIALECT) !== null && _a !== void 0 ? _a : "postgres";
const host = String(process.env.DB_HOST);
const port = +((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : '5432'); // Default to port 5432 if not specified
console.log({ database, username, password, dialect, host, port });
const sequelize = new sequelize_1.Sequelize(database, username, password, {
    host,
    dialect,
    port: port,
    logging: false,
});
exports.default = sequelize;
