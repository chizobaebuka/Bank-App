import moment from "moment";
import TokenDataSource from "../datasources/token-datasource";
import { IFindTokenQuery, IToken, ITokenCreationBody, ITokenDataSource } from "../interfaces/token-interface";
import Utility from "../utils/index.utils";

class TokenService {
    private tokenDataSource: TokenDataSource;
    private readonly tokenExpires: number = 5;
    public TokenTypes  = {
        FORGOT_PASSWORD: "FORGOT_PASSWORD",
    }

    public TokenStatus = {
        USED: "USED",
        NOT_USED: "NOT_USED"
    }

    constructor(_TokenDataSource: ITokenDataSource) {
        this.tokenDataSource = _TokenDataSource;
    }
    
    async getTokenByField(record: Partial<IToken>) {
        const query = { where: { ...record }, raw: true} as IFindTokenQuery;
        return this.tokenDataSource.fetchOne(query);
    }

    async createForgotPasswordToken (email: string): Promise<IToken>  {
        const tokenData = {
            key: email, 
            type: "FORGOT_PASSWORD",
            expires: moment().add(this.tokenExpires, 'minutes').toDate(),
            status: this.TokenStatus.NOT_USED,
        } as ITokenCreationBody;

        const token = await this.createToken(tokenData);
        return token;
    }

    async createToken(record: ITokenCreationBody) {
        const tokenData = { ...record }
        let validCode = false;
        while (!validCode) {
            tokenData.code = Utility.generateCode(6);
            const isCodeExist = await this.getTokenByField({ code: tokenData.code })
            if (!isCodeExist) {
                validCode = true;
                break;
            }
        }
        return this.tokenDataSource.create(tokenData);
    }
}

export default TokenService;