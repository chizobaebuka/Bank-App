import { Request, Response } from "express";
import UserService from "../services/user-service";

class UserController {
    private userService: UserService;

    constructor(_userService: UserService) {
        this.userService = _userService;
    }

    async registerUser (req: Request, res: Response) {
        try {
            const response = await this.userService.createUser(req.body);
            res.status(201).json(response);
        } catch (e: any) {
            res.status(500).json({ status: false, message: e.message });
        }
    }

    async loginUser (req: Request, res: Response) {
        try {
            const response = await this.userService.loginUser(req.body);
            res.status(200).json(response);
        } catch (e: any) {
            res.status(500).json({ status: false, message: e.message });
        }
    }

    async forgotPassword (req: Request, res: Response) {
        try {
            const response = await this.userService.forgotPassword(req.body);
            res.status(200).json(response);
        } catch (e: any) {
            res.status(500).json({ status: false, message: e.message });
        }
    }

    async resetPassword (req: Request, res: Response) {
        try {
            const response = await this.userService.resetPassword(req.body);
            res.status(200).json(response);
        } catch (e: any) {
            res.status(500).json({ status: false, message: e.message });
        }
    }
}

export default UserController;