import { IAccount, IAccountCreationBody, IAccountDataSource, IFindAccountQuery } from "../interfaces/account-interface"
import AccountModel from "../models/account-model";


class AccountDataSource implements IAccountDataSource {
    async fetchOne(query: IFindAccountQuery): Promise<IAccount | null> {
        return await AccountModel.findOne({ where: query.where });
    }

    async create(data: IAccountCreationBody): Promise<IAccount> {
        return await AccountModel.create(data);
    }

    async updateOne(searchBy: IFindAccountQuery, data: Partial<IAccount>): Promise<void> {
        await AccountModel.update(data, { where: searchBy.where });
    }

}

export default AccountDataSource;