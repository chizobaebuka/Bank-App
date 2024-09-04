"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const database = String(process.env.DB_NAME);
const username = String(process.env.DB_USERNAME);
const password = String(process.env.DB_PASSWORD);
const dialect = (_a = process.env.DB_DIALECT) !== null && _a !== void 0 ? _a : "postgres";
const host = String(process.env.DB_HOST);
const port = +((_b = process.env.DB_PORT) !== null && _b !== void 0 ? _b : '5432');
const sequelize = new sequelize_1.Sequelize(database, username, password, {
    host,
    dialect,
    port: port,
    logging: false,
});
exports.default = sequelize;
