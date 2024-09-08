import { Model, Optional } from "sequelize";

export interface IUser {
    id: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    role: string;
    isEmailVerified: string;
    accountStatus: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFindUserQuery {
    where: {
        [key: string]: string;
    },
    raw?: boolean;
    attributes?: string[];
    returning: boolean;
}

export interface IUserCreationBody extends Optional<IUser, "id" | "createdAt" | "updatedAt"> {}

export interface IUserModel extends Model<IUser, IUserCreationBody>, IUser {}

export interface IUserDataSource {
    fetchOne(query: IFindUserQuery): Promise<IUser | null>;
    create(data: IUserCreationBody): Promise<IUser>;
    updateOne(searchBy: IFindUserQuery, data: Partial<IUser>): Promise<void>;
}