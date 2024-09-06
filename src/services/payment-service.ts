import { IPaystackPaymentObject } from "../interfaces/transaction-interface";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

class PaymentService {
    private static generatePaystackReference(): string {
        return uuidv4();
    }

    public static async generatePaystackPaymentUrl(email: string, amount: number): Promise<IPaystackPaymentObject | null> {
        try {
            const amountInKobo = amount * 100; // Convert amount to kobo
            const params = {
                email,
                amount: amountInKobo,
                channels: ["card"], // Make sure Paystack account supports the channels
                callback_url: `${process.env.PAYSTACK_CALLBACK_URL}`, // Ensure this URL is reachable and correct
                reference: this.generatePaystackReference(),
            };

            const config = {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Ensure secret key is correct
                    'Content-Type': 'application/json',
                }
            };

            const response = await axios.post("https://api.paystack.co/transaction/initialize", params, config);

            if (response.data && response.data.status) {
                return response.data.data; // Return the payment object if successful
            }

            console.error('Paystack response status was false:', response.data); // Log Paystack response if status is false
            return null;
        } catch (err) {
            console.error('Error initializing Paystack transaction:', err); // Log the error for better debugging
            return null;
        }
    }

    public static async verifyPaystackPayment(reference: string, amount: number): Promise<boolean> {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            };
    
            const { data } = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, config);
            console.log('Paystack verification response:', data);
    
            // Verify that the amount matches
            if (data && data.status) {
                const { amount: amountInKobo } = data.data;
                if (amountInKobo !== (amount * 100)) {
                    return false; // Amount mismatch
                }
                return true; // Payment is verified
            }
        } catch (err) {
            return false; // Error occurred during verification
        }
        return false; // Default to false if verification fails
    }
    
}

export default PaymentService;