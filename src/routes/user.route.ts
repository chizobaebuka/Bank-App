import express, { Request, Response } from 'express';
import UserController from '../controllers/user-controller';
import UserService from '../services/user-service';
import { validator } from '../middlewares/index.middleware';import validationSchema from '../validators/user-validator.schema';
import UserDataSource from '../datasources/user-datasource';
import TokenService from '../services/token-service';
import TokenDataSource from '../datasources/token-datasource';

const createUserRoute = () => {
    const router = express.Router();
    const tokenService = new TokenService(new TokenDataSource())
    const userDataSource = new UserDataSource();
    const userService = new UserService(userDataSource);
    const userController = new UserController(userService, tokenService);

    router.post('/register', validator(validationSchema.registerSchema), (req: Request, res: Response) => {
        return userController.registerUser(req, res);
    })

    router.post('/login', validator(validationSchema.loginSchema), (req: Request, res: Response) => {
        return userController.loginUser(req, res);
    })

    router.post('/forgot-password', validator(validationSchema.forgotPasswordSchema), (req: Request, res: Response) => {
        return userController.forgotPassword(req, res);
    })

    // router.post('/reset-password', (req: Request, res: Response) => {
    //     return userController.resetPassword(req, res);
    // })

    return router;
}

export default createUserRoute();