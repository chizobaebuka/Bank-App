import express, { Request, Response, NextFunction, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import DbInitialize from './src/database/init';
import userRouter from './src/routes/user.route';
import accountRouter from './src/routes/account-route';
import transactionRouter from './src/routes/transaction-route';

dotenv.config();

const app: Application = express();

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((err: TypeError, req: Request, res: Response, next: NextFunction) => {
    try {
        if(err) {
            res.status(500).json({ status: false, message: (err as TypeError).message })
        }
    } catch (e: any) {}
})

app.use('/api/user', userRouter);
app.use('/api/account', accountRouter);
app.use('/api/transaction', transactionRouter);

app.get('/', (req: Request, res: Response) => {
    res.send(`Welcome to ${ process.env.APP_NAME }`)
});

const PORT = process.env.PORT || 8080;

const Bootstrap = async function () {
    try {
        await DbInitialize();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e: any) {
        console.error("Error starting server", e);
    }
}

Bootstrap();
