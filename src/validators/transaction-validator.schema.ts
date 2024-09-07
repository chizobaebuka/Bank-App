import * as yup from 'yup';

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

const validationSchema = {
    initiatePaystackDepositSchema,
    verifyPaystackTransactionSchema,
    makeInternalTransferSchema
}

export default validationSchema;