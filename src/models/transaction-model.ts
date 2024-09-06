import Db from '../database/index';
import { Model, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { ITransactionModel } from '../interfaces/transaction-interface';
import Utility from '../utils/index.utils';

const TransactionModel = Db.define<ITransactionModel>('TransactionModel', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuidv4(),
        allowNull: false, // do you want it to be null or not?
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accountId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    detail: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(30, 2),
        allowNull: false,
        defaultValue: 0.0,
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
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    hooks: {
        beforeCreate: (transaction: any, options) => {
            if(transaction.detail && typeof transaction.detail == 'object') {
                transaction.detail = JSON.stringify(transaction.detail) as any;
            }
        },
        beforeUpdate: (transaction: any, options) => {
            if(transaction.detail && typeof transaction.detail == 'object') {
                transaction.detail = JSON.stringify(transaction.detail) as any;
            }
        },
        afterCreate: (transaction: any, options) => {
            if(transaction && typeof transaction == 'object') {
                transaction.detail = Utility.parseToObject(transaction.detail);
            }
        },
        afterFind: (transaction: any, options) => {
            if(Array.isArray(transaction)) {
                transaction.forEach((tx, value) => {
                    if(tx.detail && typeof tx.detail == 'string') {
                        tx.detail = Utility.parseToObject(tx.detail);
                    }
                })
            } else {
                if(transaction && typeof transaction == 'object') {
                    transaction.detail = Utility.parseToObject(transaction.detail);
                }
            }
        }
    }
});

export default TransactionModel;