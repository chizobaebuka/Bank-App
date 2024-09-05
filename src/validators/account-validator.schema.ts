import * as yup from 'yup';
import { AccountTypes } from '../interfaces/enum/account-enum';

const createAccountSchema = yup.object({
    type: yup.string().trim().required().oneOf(Object.values(AccountTypes)),
})

const validationSchema = {
    createAccountSchema,
}

export default validationSchema;