import { FindOptions, Model, Optional, Transaction } from "sequelize";

export interface IVirtualAccountData {
    status: boolean;
    message: string;
    data: {
        bank: {
            name: string;
            id: number;
            slug: string;
        };
        account_name: string;
        account_number: string;
        assigned: boolean;
        currency: string;
        metadata: any; // Use a more specific type if known
        active: boolean;
        id: number;
        created_at: Date; // Use ISO string or Date if needed
        updated_at: Date; // Use ISO string or Date if needed
        assignment: {
            integration: number;
            assignee_id: number;
            assignee_type: string;
            expired: boolean;
            account_type: string;
            assigned_at: Date; // Use ISO string or Date if needed
        };
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone: string;
            risk_action: string;
        };
    };
}

export interface IAssignVirtualAccountResponse {
    status: boolean;
    message: string;
    data: any; // Modify this based on the actual response structure, if known
}
export interface IAccount {
    id: string;
    userId: string;
    paystackCustomerId?: string;  // New field for Paystack customer ID
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
    transaction?: Transaction;
}

export interface IAccountCreationBody extends Optional<IAccount, "id" | "createdAt" | "updatedAt"> {}

export interface IAccountModel extends Model<IAccount, IAccountCreationBody>, IAccount {}

export interface IAccountDataSource {
    fetchOne(query: IFindAccountQuery): Promise<IAccount | null>;
    create(data: IAccountCreationBody): Promise<IAccount>;
    updateOne(searchBy: IFindAccountQuery, data: Partial<IAccount>): Promise<void>;
    fetchAll(query: FindOptions<IAccount>): Promise<IAccount[]>;
}