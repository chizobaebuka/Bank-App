import { Request, Response } from "express";
import Utility from "../utils/index.utils";
import { ResponseCode } from "../interfaces/enum/code-enum";
import AccountService from "../services/account-service";
import { IAccountCreationBody } from "../interfaces/account-interface";

class AccountController {
    private accountService: AccountService;

    constructor(_accountService: AccountService) {
        this.accountService = _accountService;
    }

    async createAccount(req: Request, res: Response) {
        try {
            const params = { ...req.body };

            const newAccount = {
                userId: params.user.id,
                type: params.type,
            } as IAccountCreationBody;

            const account = await this.accountService.createAccount(newAccount);
            if (!account) {
                return Utility.handleError(res, "Failed to create account", ResponseCode.SERVER_ERROR);
            }

            return Utility.handleSuccess(res, "Account Created Successfully", { account }, ResponseCode.SUCCESS);
        } catch (e: any) {
            return Utility.handleError(res, (e as TypeError).message, ResponseCode.SERVER_ERROR);
        }
    }
}

export default AccountController;
