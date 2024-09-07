import { Request, Response } from "express";
import Utility from "../utils/index.utils";
import { ResponseCode } from "../interfaces/enum/code-enum";
import AccountService from "../services/account-service";
import { IAccount, IAccountCreationBody } from "../interfaces/account-interface";
import PaymentService from "../services/payment-service";
import TransactionService from "../services/transaction-service";
import { TransactionStatus } from "../interfaces/enum/transaction-enum";
import sequelize from "../database";
import { IFindTransactionQuery, ITransaction } from "../interfaces/transaction-interface";

class TransactionController {
    private transactionService: TransactionService;
    private accountService: AccountService;

    constructor(_transactionService: TransactionService, _accountService: AccountService) {
        this.transactionService = _transactionService;
        this.accountService = _accountService;
    }

    private async deposit(accountId: string, transactionId: string, amount: number): Promise<boolean> {
        const tx = await sequelize.transaction();
        try {
            // Top up account balance
            await this.accountService.topUpBalance(accountId, amount, { transaction: tx });
    
            // Update transaction status to COMPLETED
            await this.transactionService.setStatus(transactionId, "COMPLETED", { transaction: tx });
    
            await tx.commit(); // Commit transaction
            return true;
        } catch (err) {
            await tx.rollback(); // Rollback on error
            return false;
        }
    }

    private async transfer(senderAccount: IAccount, receiverAccount: IAccount, amount: number): Promise<{ status: boolean, transaction: ITransaction|null }> {
        const tx = await sequelize.transaction();
        try {
            await this.accountService.topUpBalance(senderAccount.id, -amount, { transaction: tx });
            await this.accountService.topUpBalance(receiverAccount.id, amount, { transaction: tx });

            const newTransaction = {
                userId: senderAccount.userId,
                accountId: senderAccount.id,
                amount,
                detail: {
                    receiverAccountNumber: receiverAccount.accountNumber,
                },
            }

            let transfer = await this.transactionService.processInternalTransfer( newTransaction, { transaction: tx });
            await tx.commit(); // Commit transaction
            return {
                status: true,
                transaction: transfer
            }
        } catch (err) {
            await tx.rollback(); // Rollback on error
            return {
                status: false,
                transaction: null
            }
        }
    }
    

    async initiatePaystackDeposit(req: Request, res: Response) {
        try {
            const params = { ...req.body };
            const depositInfo = await PaymentService.generatePaystackPaymentUrl(params.user.email, params.amount);
            if (!depositInfo) {
                return Utility.handleError(res, "Paystack payment not available, try again in few seconds", ResponseCode.NOT_FOUND);
            }
            const newTransaction = {
                userId: params.user.id,
                accountId: params.accountId,
                amount: params.amount,
                reference: depositInfo.reference,
                detail: {},
            };

            let deposit = await this.transactionService.depositByPaystack(newTransaction);
            return Utility.handleSuccess(res, "Transaction Created Successfully", { transaction: deposit, url: depositInfo.authorization_url }, ResponseCode.SUCCESS);
        } catch (e: any) {
            return Utility.handleError(res, (e as TypeError).message, ResponseCode.SERVER_ERROR);
        }
    }

    async verifyPaystackDeposit(req: Request, res: Response) {
        try {
            const params = { ...req.body };
            let transaction = await this.transactionService.fetchTransactionByReference(params.reference);
            if (!transaction) {
                return Utility.handleError(res, "Invalid transaction reference", ResponseCode.NOT_FOUND);
            }

            console.log({ tra: transaction.status })
    
            if (transaction.status !== "IN_PROGRESS") {
                return Utility.handleError(res, "Transaction status not supported", ResponseCode.NOT_FOUND);
            }
    
            const isValidPaymentTx = await PaymentService.verifyPaystackPayment(params.reference, transaction.amount);
    
            console.log('Paystack transaction verification result:', isValidPaymentTx);
            if (!isValidPaymentTx) {
                return Utility.handleError(res, "Invalid transaction reference", ResponseCode.NOT_FOUND);
            }
    
            const deposit = await this.deposit(transaction.accountId, transaction.id, transaction.amount);
    
            if (!deposit) {
                return Utility.handleError(res, "Deposit failed", ResponseCode.NOT_FOUND);
            }
    
            return Utility.handleSuccess(res, "Deposit was completed successfully", { transaction }, ResponseCode.SUCCESS);
        } catch (error) {
            console.error('Error during Paystack deposit verification:', error);
            return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
        }
    }
    

    async internalTransfer(req: Request, res: Response) {
        try {
            const params = { ...req.body };
            const senderAccount = await this.accountService.getAccountByField({ id: params.senderAccountId });
            if(!senderAccount) {
                return Utility.handleError(res, "Sender account not found", ResponseCode.NOT_FOUND);
            }

            if(senderAccount.balance < params.amount) {
                return Utility.handleError(res, "Insufficient balance", ResponseCode.BAD_REQUEST);
            }

            if(params.amount <= 0) {
                return Utility.handleError(res, "Amount must be greater than zero", ResponseCode.BAD_REQUEST);
            }

            const receiverAccount = await this.accountService.getAccountByField({ accountNumber: params.receiverAccountNumber });
            if(!receiverAccount) {
                return Utility.handleError(res, "Receiver account not found", ResponseCode.NOT_FOUND);
            }

            if(senderAccount.userId === receiverAccount.userId) {
                return Utility.handleError(res, "You can't transfer to yourself", ResponseCode.BAD_REQUEST);
            }

            const result = await this.transfer(senderAccount, receiverAccount, params.amount);
            if(!result.status) {
                return Utility.handleError(res, "Transfer failed", ResponseCode.NOT_FOUND);
            }

            return Utility.handleSuccess(res, "Transfer completed successfully", { transaction: result.transaction }, ResponseCode.SUCCESS);
        } catch (error) {
            return Utility.handleError(res, (error as TypeError).message, ResponseCode.SERVER_ERROR);
            
        }
    }
}

export default TransactionController;
