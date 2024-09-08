"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const index_utils_1 = __importDefault(require("../utils/index.utils"));
const PayeeModel = database_1.default.define('PayeeModel', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: () => (0, uuid_1.v4)(),
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bankCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: sequelize_1.DataTypes.JSON,
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
    },
}, {
    timestamps: true,
    tableName: 'payees',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    hooks: {
        beforeCreate: (payee, options) => __awaiter(void 0, void 0, void 0, function* () {
            if (payee.detail && typeof payee.detail == "object") {
                payee.detail = JSON.stringify(payee.detail);
            }
        }),
        beforeUpdate: (payee, options) => __awaiter(void 0, void 0, void 0, function* () {
            if (payee.detail && typeof payee.detail == "object") {
                payee.detail = JSON.stringify(payee.detail);
            }
        }),
        afterCreate: (payee, options) => __awaiter(void 0, void 0, void 0, function* () {
            if (payee && typeof payee == "object") {
                payee.detail = index_utils_1.default.parseToObject(payee.detail);
            }
        }),
        afterFind: (payee, options) => __awaiter(void 0, void 0, void 0, function* () {
            if (Array.isArray(payee)) {
                payee.forEach((tx, index) => {
                    if (tx.detail && typeof tx.detail === "string") {
                        tx.detail = index_utils_1.default.parseToObject(tx.detail);
                        tx.bankName = index_utils_1.default.getBankName(tx.bankCode);
                    }
                });
            }
            else {
                if (payee && typeof payee == "object") {
                    payee.detail = index_utils_1.default.parseToObject(payee.detail);
                    payee.bankName = index_utils_1.default.getBankName(payee.bankCode);
                }
            }
        }),
    },
});
exports.default = PayeeModel;
