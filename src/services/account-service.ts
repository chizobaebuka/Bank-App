import AccountDataSource from "../datasources/account-datasource";
import { IAccount, IAccountCreationBody, IAccountDataSource, IFindAccountQuery } from "../interfaces/account-interface";
import { AccountStatus } from "../interfaces/enum/account-enum";

class AccountService {
    private accountDataSource: AccountDataSource;

    constructor(_accountDataSource: IAccountDataSource) {
        this.accountDataSource = _accountDataSource;
    }

    async getAccountByField(record: Partial<IAccount>) {
        const query = { where: { ...record }, raw: true} as IFindAccountQuery;
        return this.accountDataSource.fetchOne(query);
    }

    private generateAccountNumber() {
        let accountNumber = "";
        for(let i = 0; i < 10; i++) {
            accountNumber += Math.floor(Math.random() * 10);
        }
        return accountNumber;
    }

    private async createAccountNumber() {
        let accountNumber = ""
        let accountExist = false;
        while (!accountExist) {
            accountNumber = this.generateAccountNumber();
            const isAccountExist = await this.accountDataSource.fetchOne({
                where: { accountNumber },
                returning: false,
                raw: true
            });
            if (!isAccountExist) {
                accountExist = true;
                break;
            }
        }

        return accountNumber;
    }

    async createAccount(data: Partial<IAccountCreationBody>) {
        const record = { 
            ...data,
            accountNumber: await this.createAccountNumber(),
            status: AccountStatus.ACTIVE,
            balance: 0.00,
        } as IAccountCreationBody;

        return this.accountDataSource.create(record);
    }

    async updateRecord(searchBy: Partial<IAccount>, record: Partial<IAccount>): Promise<void> {
        const query = { where: { ...searchBy } } as IFindAccountQuery;
        return this.accountDataSource.updateOne(query, record);
    }
}

export default AccountService;