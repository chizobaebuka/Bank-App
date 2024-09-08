import * as yup from 'yup';

const registerSchema = yup.object({
    firstname: yup.string().lowercase().trim().required(),
    lastname: yup.string().lowercase().trim().required(),
    email: yup.string().email().lowercase().trim().required(),
    phone: yup.string().trim().required(), // Include the country code (e.g. +234) before the phone number
    password: yup.string().min(6).required(),
})

const loginSchema = yup.object({
    email: yup.string().email().lowercase().trim().required(),
    password: yup.string().min(6).required(),
})

const forgotPasswordSchema = yup.object({
    email: yup.string().email().lowercase().trim().required(),
})

const resetPasswordSchema = yup.object({
    code: yup.string().trim().required(),
    email: yup.string().email().lowercase().trim().required(),
    password: yup.string().min(6).required(),
})

const createPaystackCustomerSchema = yup.object({
    email: yup.string().email().lowercase().trim().required(),
    first_name: yup.string().lowercase().trim().required(),
    last_name: yup.string().lowercase().trim().required(),
    phone: yup.string().trim().required(), // Include the country code (e.g. +234) before the phone number
})

const createDedicatedVirtualPaystackAccountSchema = yup.object({
    customerId: yup.number().required(),
    preferredBank: yup.string().required(),
})

const assignDedicatedVirtualAccountSchema = yup.object({
    email: yup.string().email().lowercase().trim().required(),
    first_name: yup.string().lowercase().trim().required(),
    last_name: yup.string().lowercase().trim().required(),
    phone: yup.string().trim().required(), // Include the country code (e.g. +234) before the phone number
    preferredBank: yup.string().required(),
    country: yup.string().required(),
})

const validationSchema = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    createPaystackCustomerSchema,
    createDedicatedVirtualPaystackAccountSchema,
    assignDedicatedVirtualAccountSchema,
}

export default validationSchema;