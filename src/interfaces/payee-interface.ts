import { FindOptions, Model, Optional, Transaction } from "sequelize";

export interface IPaystackCustomerData {
    email: string;
    integration: number;
    domain: string;
    customer_code: string;
    id: number;
    identified: boolean;
    identifications: any; // Update this type if you know the structure of identifications
    createdAt: Date; // Could use Date if you parse it
    updatedAt: Date; // Could use Date if you parse it
}

export interface IPaystackCustomerResponse {
    status: boolean;
    message: string;
    data: IPaystackCustomerData;
}

export interface IPayeePaystackDetail {
    accountNumber: string;
    accountName: string;
    bankCode: string;
}

export interface IPayeeDetail {
    paystackRecipientId?: string;
}

export interface IPayee {
    id: string;
    userId: string;
    accountName: string;
    accountNumber: string;
    bankCode: string;
    detail: IPayeeDetail;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindPayeeQuery {
    where: {
        [key: string]: string;
    };
    transaction?: Transaction;
    raw?: boolean;
    returning?: boolean;
}

export interface IPayeeCreationBody extends Optional<IPayee, "id" | "createdAt" | "updatedAt"> { }

export interface IPayeeModel extends Model<IPayee, IPayeeCreationBody>, IPayee { }

export interface IPayeeDataSource {
    fetchOne(query: IFindPayeeQuery): Promise<IPayee | null>;
    create(record: IPayeeCreationBody): Promise<IPayee>;
    updateOne(data: Partial<IPayee>, query: IFindPayeeQuery): Promise<void>;
    fetchAll(query: FindOptions<IPayee>): Promise<IPayee[]>;
}