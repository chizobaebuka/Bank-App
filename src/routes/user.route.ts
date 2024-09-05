import express, { Request, Response } from 'express';
import UserController from '../controllers/user-controller';
import UserService from '../services/user-service';
import { validator } from '../middlewares/index.middleware';import validationSchema from '../validators/user-validator.schema';
import UserDataSource from '../datasources/user-datasource';
import TokenService from '../services/token-service';
import TokenDataSource from '../datasources/token-datasource';

const router = express.Router();
const tokenService = new TokenService(new TokenDataSource())
const userDataSource = new UserDataSource();
export const userService = new UserService(userDataSource);
const userController = new UserController(userService, tokenService);

const createUserRoute = () => {

    router.post('/register', validator(validationSchema.registerSchema), (req: Request, res: Response) => {
        return userController.registerUser(req, res);
    })

    router.post('/login', validator(validationSchema.loginSchema), (req: Request, res: Response) => {
        return userController.loginUser(req, res);
    })

    router.post('/forgot-password', validator(validationSchema.forgotPasswordSchema), (req: Request, res: Response) => {
        return userController.forgotPassword(req, res);
    })

    router.post('/reset-password', validator(validationSchema.resetPasswordSchema), (req: Request, res: Response) => {
        return userController.resetPassword(req, res);
    })

    return router;
}

export default createUserRoute();