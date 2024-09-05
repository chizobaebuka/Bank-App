import express, { Request, Response } from 'express';
import UserController from '../controllers/user-controller';
import UserService from '../services/user-service';
import { validator } from '../middlewares/index.middleware';import validationSchema from '../validators/user-validator.schema';

const createUserRoute = () => {
    const router = express.Router();
    const userService = new UserService();
    const userController = new UserController(userService);

    router.post('/register', validator(validationSchema.registerSchema), (req: Request, res: Response) => {
        return userController.registerUser(req, res);
    })

    router.post('/login', (req: Request, res: Response) => {
        return userController.loginUser(req, res);
    })

    router.post('/forgot-password', (req: Request, res: Response) => {
        return userController.forgotPassword(req, res);
    })

    router.post('/reset-password', (req: Request, res: Response) => {
        return userController.resetPassword(req, res);
    })

    return router;
}

export default createUserRoute();