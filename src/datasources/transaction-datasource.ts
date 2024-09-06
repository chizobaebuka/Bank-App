import { FindOptions } from "sequelize";
import { IAccount, IAccountCreationBody, IAccountDataSource, IFindAccountQuery } from "../interfaces/account-interface"
import { IFindTransactionQuery, ITransaction, ITransactionCreationBody, ITransactionDataSource } from "../interfaces/transaction-interface";
import TransactionModel from "../models/transaction-model";


class TransactionDataSource implements ITransactionDataSource {
    async fetchOne(query: IFindTransactionQuery): Promise<ITransaction | null> {
        return await TransactionModel.findOne({ where: query.where });
    }

    async create(data: ITransactionCreationBody): Promise<ITransaction> {
        return await TransactionModel.create(data);
    }

    async updateOne(searchBy: IFindTransactionQuery, data: Partial<ITransaction>): Promise<void> {
        await TransactionModel.update(data, { where: searchBy.where });
    }

    async fetchAll(query: FindOptions<ITransaction>): Promise<ITransaction[]> {
        return await TransactionModel.findAll({ where: query.where });
    }

}

export default TransactionDataSource;