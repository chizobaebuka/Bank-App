import { IFindTokenQuery, IToken, ITokenCreationBody, ITokenDataSource } from "../interfaces/token-interface";
import { IFindUserQuery, IUser, IUserCreationBody } from "../interfaces/user.interface";
import TokenModel from "../models/token-model";
import UserModel from "../models/user.model";


class TokenDataSource implements ITokenDataSource {
    async create(data: ITokenCreationBody): Promise<IToken> {
        return await TokenModel.create(data);
    }

    async fetchOne(query: IFindTokenQuery): Promise<IToken | null> {
        return await TokenModel.findOne({ where: query.where });
    }

    async updateOne(data: Partial<IToken>, query: IFindTokenQuery): Promise<void> {
        await TokenModel.update(data, { where: query.where });
    }
}

export default TokenDataSource;