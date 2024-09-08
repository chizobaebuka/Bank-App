"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../database/index"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const UserModel = index_1.default.define('UserModel', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => (0, uuid_1.v4)(),
        allowNull: false, // do you want it to be null or not?
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isEmailVerified: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    accountStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
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
    tableName: 'users',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});
exports.default = UserModel;
