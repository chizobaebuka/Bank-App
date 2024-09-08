import { Model, Optional, Transaction } from "sequelize";

export interface ITransactionDetail {
    gateway?: string;
    receiverAccountNumber?: string;
}

export interface IPaystackPaymentObject {
    authorization_url: string;
    access_code: string;
    reference: string;
}

export interface Bank {
    id: number;
    name: string;
    slug: string;
    code: string;
    longcode: string;
    gateway: string | null;
    pay_with_bank: boolean;
    supports_transfer: boolean;
    active: boolean;
    country: string;
    currency: string;
    type: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IPaystackTransferObject {
    transferCode: string;
    reference: string;
}

export interface ITransaction {
    id: string;
    userId: string;
    reference: string;
    accountId: string;
    amount: number;
    detail: ITransactionDetail;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindTransactionQuery {
    where: {
        [key: string]: string;
    };
    transaction?:Transaction;
    raw?: boolean;
    returning?: boolean;
}

export interface ITransactionCreationBody extends Optional<ITransaction, "id" | "createdAt" | "updatedAt"> {}

export interface ITransactionModel extends Model<ITransaction, ITransactionCreationBody>, ITransaction {}

export interface ITransactionDataSource {
    fetchOne(query: IFindTransactionQuery): Promise<ITransaction | null>;
    create(data: ITransactionCreationBody, options?: Partial<IFindTransactionQuery>): Promise<ITransaction>;
    updateOne(searchBy: IFindTransactionQuery, data: Partial<ITransaction>): Promise<void>;
}