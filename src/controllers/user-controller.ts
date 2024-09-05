import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import UserService from "../services/user-service";
import { AccountStatus, EmailStatus, UserRoles } from "../interfaces/enum/user-enum";
import { IUserCreationBody } from "../interfaces/user.interface";
import Utility from "../utils/index.utils";
import { ResponseCode } from "../interfaces/enum/code-enum";

class UserController {
    private userService: UserService;

    constructor(_userService: UserService) {
        this.userService = _userService;
    }

    async registerUser (req: Request, res: Response) {
        try {
            const params = { ...req.body };

            const newUser = { 
                firstname: params.firstname,
                lastname: params.lastname,
                email: params.email,
                username: params.email.split('@')[0],
                password: params.password,
                role: UserRoles.CUSTOMER,
                isEmailVerified: EmailStatus.NOT_VERIFIED,
                accountStatus: AccountStatus.ACTIVE,
            } as IUserCreationBody;

            // hashing the password 
            newUser.password = bcrypt.hashSync(newUser.password, 10);

            const userExists = await this.userService.getUserByField({ email: newUser.email });
            if (userExists) {
                return Utility.handleError(res, 'Email Already Exists', ResponseCode.ALREADY_EXIST)
            }

            const user = await this.userService.createUser(newUser);
            user.password = '';

            return Utility.handleSuccess(res, 'User Registered Successfully', { user }, ResponseCode.SUCCESS);


            // const response = await this.userService.createUser(req.body);
            // res.status(201).json(response);
        } catch (e: any) {
            res.status(500).json({ status: false, message: e.message });
        }
    }

    // async loginUser (req: Request, res: Response) {
    //     try {
    //         const response = await this.userService.loginUser(req.body);
    //         res.status(200).json(response);
    //     } catch (e: any) {
    //         res.status(500).json({ status: false, message: e.message });
    //     }
    // }

    // async forgotPassword (req: Request, res: Response) {
    //     try {
    //         const response = await this.userService.forgotPassword(req.body);
    //         res.status(200).json(response);
    //     } catch (e: any) {
    //         res.status(500).json({ status: false, message: e.message });
    //     }
    // }

    // async resetPassword (req: Request, res: Response) {
    //     try {
    //         const response = await this.userService.resetPassword(req.body);
    //         res.status(200).json(response);
    //     } catch (e: any) {
    //         res.status(500).json({ status: false, message: e.message });
    //     }
    // }
}

export default UserController;