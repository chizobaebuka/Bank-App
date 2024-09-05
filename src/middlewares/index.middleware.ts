import { NextFunction, Request, Response } from "express";
import { Schema } from "yup";
import Utility from "../utils/index.utils";
import { ResponseCode } from "../interfaces/enum/code-enum";

export const validator = (schema: Schema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validate(req.body, { abortEarly: false });
            return next();
        } catch (error: any) {
            return Utility.handleError(res, error.errors.join(", "), ResponseCode.BAD_REQUEST);
        }
    };
}