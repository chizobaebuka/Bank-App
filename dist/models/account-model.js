"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../database/index"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const AccountModel = index_1.default.define('AccountModel', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => (0, uuid_1.v4)(),
        allowNull: false, // do you want it to be null or not?
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(30, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        allowNull: false,
    }
}, {
    tableName: 'accounts',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});
exports.default = AccountModel;
