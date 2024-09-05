import UserDataSource from "../datasources/user-datasource";
import { IFindUserQuery, IUser, IUserCreationBody, IUserDataSource } from "../interfaces/user.interface";
import UserModel from "../models/user.model";

class UserService {
    private userDataSource: UserDataSource;

    constructor(_userDataSource: IUserDataSource) {
        this.userDataSource = _userDataSource;
    }

    async getUserByField(record: Partial<IUser>) {
        const query = { where: { ...record }, raw: true} as IFindUserQuery;
        return this.userDataSource.fetchOne(query);
    }

    async createUser(record: IUserCreationBody) {
        return this.userDataSource.create(record);
    }
}

export default UserService;