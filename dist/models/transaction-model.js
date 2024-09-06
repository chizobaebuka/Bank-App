"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../database/index"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const index_utils_1 = __importDefault(require("../utils/index.utils"));
const TransactionModel = index_1.default.define('TransactionModel', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => (0, uuid_1.v4)(),
        allowNull: false, // do you want it to be null or not?
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0.0,
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
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    hooks: {
        beforeCreate: (transaction, options) => {
            if (transaction.detail && typeof transaction.detail == 'object') {
                transaction.detail = JSON.stringify(transaction.detail);
            }
        },
        beforeUpdate: (transaction, options) => {
            if (transaction.detail && typeof transaction.detail == 'object') {
                transaction.detail = JSON.stringify(transaction.detail);
            }
        },
        afterCreate: (transaction, options) => {
            if (transaction && typeof transaction == 'object') {
                transaction.detail = index_utils_1.default.parseToObject(transaction.detail);
            }
        },
        afterFind: (transaction, options) => {
            if (Array.isArray(transaction)) {
                transaction.forEach((tx, value) => {
                    if (tx.detail && typeof tx.detail == 'string') {
                        tx.detail = index_utils_1.default.parseToObject(tx.detail);
                    }
                });
            }
            else {
                if (transaction && typeof transaction == 'object') {
                    transaction.detail = index_utils_1.default.parseToObject(transaction.detail);
                }
            }
        }
    }
});
exports.default = TransactionModel;
