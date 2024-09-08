import * as yup from 'yup';
import { BANK_CODES } from '../interfaces/enum/bank-enum';

const initiatePaystackDepositSchema = yup.object({
    amount: yup.number().required(),
    accountId: yup.string().trim().required(),
})

const verifyPaystackTransactionSchema = yup.object({
    reference: yup.string().trim().required(),
})

const makeInternalTransferSchema = yup.object({
    senderAccountId: yup.string().trim().required(),
    receiverAccountNumber: yup.string().trim().required(),
    amount: yup.number().required(),
})

const makeWithdrawalByPaystackSchema = yup.object({
    senderAccountId: yup.string().trim().required(),
    receiverAccountNumber: yup.string().trim().required(),
    receiverAccountName: yup.string().trim().required(),
    bankCode: yup.string().trim().required().oneOf(BANK_CODES),
    message: yup.string().trim().required(),
    amount: yup.number().required(),
})

const fetchPaystackBanksSchema = yup.object({
    // Add any required query parameters or headers here, e.g., authorization token
    // Assuming no additional validation is needed for fetching banks, this can be an empty object
    query: yup.object({}).noUnknown(true),  // Adjust this if your endpoint requires specific query parameters
});

const validationSchema = {
    initiatePaystackDepositSchema,
    verifyPaystackTransactionSchema,
    makeInternalTransferSchema,
    makeWithdrawalByPaystackSchema,
    fetchPaystackBanksSchema,
}

export default validationSchema;