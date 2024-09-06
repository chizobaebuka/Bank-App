import * as yup from 'yup';

const initiatePaystackDepositSchema = yup.object({
    amount: yup.number().required(),
    accountId: yup.string().trim().required(),
})

const verifyPaystackTransactionSchema = yup.object({
    reference: yup.string().trim().required(),
})

const validationSchema = {
    initiatePaystackDepositSchema,
    verifyPaystackTransactionSchema
}

export default validationSchema;