import Db from '../database/index';
import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { IAccountModel } from '../interfaces/account-interface';

const AccountModel = Db.define<IAccountModel>('AccountModel', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false, // do you want it to be null or not?
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    paystackCustomerId: {  // New field for Paystack customer ID
        type: DataTypes.STRING,
        allowNull: true, // Make it nullable initially
        unique: true,    // Optional: if you want each ID to be unique
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    balance: {
        type: DataTypes.DECIMAL(30, 2),
        defaultValue: 0.00,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    }
}, {
    tableName: 'accounts',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
});

export default AccountModel;