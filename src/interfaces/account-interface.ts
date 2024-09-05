import { FindOptions, Model, Optional } from "sequelize";

export interface IAccount {
    id: string;
    userId: string;
    accountNumber: string;
    balance: number;
    type: Date; // SAVING_ACCOUNT, CURRENT_ACCOUNT, COOPERATE_ACCOUNT ( mostly the type of account determins the withdrawal amount, lower or higher transaction fee)
    status: string; // ACTIVE, DORMANT, FROZEN, UNDEER_REVIEW
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindAccountQuery {
    where: {
        [key: string]: string;
    },
    raw?: boolean;
    attributes?: string[];
    returning?: boolean;
}

export interface IAccountCreationBody extends Optional<IAccount, "id" | "createdAt" | "updatedAt"> {}

export interface IAccountModel extends Model<IAccount, IAccountCreationBody>, IAccount {}

export interface IAccountDataSource {
    fetchOne(query: IFindAccountQuery): Promise<IAccount | null>;
    create(data: IAccountCreationBody): Promise<IAccount>;
    updateOne(searchBy: IFindAccountQuery, data: Partial<IAccount>): Promise<void>;
    fetchAll(query: FindOptions<IAccount>): Promise<IAccount[]>;
}