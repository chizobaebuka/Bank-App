import { IFindUserQuery, IUser, IUserCreationBody, IUserDataSource } from "../interfaces/user.interface";
import UserModel from "../models/user.model";


class UserDataSource implements IUserDataSource {
    async fetchOne(query: IFindUserQuery): Promise<IUser | null> {
        return await UserModel.findOne({ where: query.where });
    }

    async create(data: IUserCreationBody): Promise<IUser> {
        return await UserModel.create(data);
    }

}

export default UserDataSource;