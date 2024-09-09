import { Bank, IPaystackPaymentObject, IPaystackTransferObject } from "../interfaces/transaction-interface";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import axios, { AxiosResponse } from 'axios';
import { IPayeePaystackDetail, IPaystackCustomerData, IPaystackCustomerResponse } from "../interfaces/payee-interface";
import { Reference } from "yup";
import Utility from "../utils/index.utils";
import { IAssignVirtualAccountResponse, IVirtualAccountData } from "../interfaces/account-interface";

class PaymentService {
    private static generatePaystackReference(): string {
        return uuidv4();
    }

    public static async createPaystackCustomer(email: string, firstName: string, lastName: string, phone: string): Promise<IPaystackCustomerData | null> {
        try {
            const params = {
                email,
                first_name: firstName,
                last_name: lastName,
                phone: phone, // Include the country code (e.g. +234) before the phone number
            };

            const { data } = await axios.post<IPaystackCustomerResponse>(`https://api.paystack.co/customer`, params, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Paystack creation customer:', data);
    
            // Verify that the amount matches
            if (data && data.status) {
                const customerData: IPaystackCustomerData = {
                    email: data.data.email,
                    integration: data.data.integration,
                    domain: data.data.domain,
                    customer_code: data.data.customer_code,
                    id: data.data.id,
                    identified: data.data.identified,
                    identifications: data.data.identifications,
                    createdAt: new Date(data.data.createdAt),
                    updatedAt: new Date(data.data.updatedAt),
                };
    
                return customerData;    
            }
            return null
        } catch (err) {
            return null
        }
    }

    public static async generateDedicatedVirtualAccountNumber(customerId: number, preferredBank: string): Promise<IVirtualAccountData | null> {
        try {
            const params = {
                customer: customerId, // Use customer id returned from createPaystackCustomer
                preferred_bank: preferredBank, // Wema Bank as default
            };

            const { data } = await axios.post(`https://api.paystack.co/dedicated_account`, params, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Paystack virtual account creation:', data);
    
            if (data && data.status) {
                return data as IVirtualAccountData; // 
            }
            return null;
        } catch (err: any) {
            console.error('Error creating Paystack virtual account:', err.response?.data || err.message);
            return null;
        }
    }

    public static async accountNumberFromPaystack(customerCode: number, preferredBank: string): Promise<string | null> {
        const virtualAccountData = await PaymentService.generateDedicatedVirtualAccountNumber(customerCode, preferredBank);
    
        if (virtualAccountData && virtualAccountData.data) {
            return virtualAccountData.data.account_number;
        }

        return null;
    }

    public static async assignDedicatedVirtualAccount(email: string, firstName: string, lastName: string, phone: string, preferredBank: string = 'wema-bank', country: string = 'NG'): Promise<IAssignVirtualAccountResponse | null> {
        try {

            const params = {
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
                preferred_bank: preferredBank,
                country
            };
    
            const { data } = await axios.post(`https://api.paystack.co/dedicated_account/assign`, params, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log('Assigning dedicated virtual account:', data);
    
            if (data && data.status) {
                return data as IAssignVirtualAccountResponse;
            }
            return null;
        } catch (err: any) {
            console.error('Error assigning Paystack virtual account:', err.response?.data || err.message);
            return null;
        }
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
            return false; // Payment verification failed
        } catch (err) {
            return false; // Error occurred during verification
        }
    }

    public static async fetchBanks(): Promise<{ Banks: Bank[], BankCodes: string[]}> {
        try {
            // Fetch the list of banks from Paystack
            const response: AxiosResponse = await axios.get('https://api.paystack.co/bank', {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const banksData: Bank[] = response.data.data;
    
            // Extracting bank codes
            const BANKCODES: string[] = banksData.map(bank => bank.code);
    
            console.log('Formatted BANKS:', banksData);
            console.log('Formatted BANKCODES:', BANKCODES);
    
            // Define the path to the enum.ts file
            const filePath = path.join(__dirname, '../interfaces/enum/bank-enum.ts');
    
            // Prepare the content to be written to the file
            const content = `
                // src/interfaces/enum/bank-enum.ts
    
                export const BANKS = ${JSON.stringify(banksData, null, 2)} as const;
    
                export const BANK_CODES = ${JSON.stringify(BANKCODES, null, 2)} as const;
            `;
    
            // Write the content to the file
            fs.writeFileSync(filePath, content);
    
            // Return the formatted data
            return { Banks: banksData, BankCodes: BANKCODES };
    
        } catch (error: any) {
            console.error('Error fetching banks from Paystack:', error.response?.data || error.message);
            return { Banks: [], BankCodes: [] };  
        }
    }

    public static async verifyAccountNumber(accountNumber: string, bankCode: string): Promise<boolean> {
        try {
            // Fetch the list of valid bank codes from Paystack
            const banksResponse: AxiosResponse = await axios.get(`https://api.paystack.co/bank`, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const validBanks = banksResponse.data.data;
            const isValidBankCode = validBanks.some((bank: any) => bank.code === bankCode);
            if (!isValidBankCode) {
                console.error('Invalid bank code provided. Please use the correct bank code.');
                return false;
            }
    
            // Proceed to validate the account number
            const url = `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
            const config = {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            };
    
            const response: AxiosResponse = await axios.get(url, config);
            const data = response.data;
    
            console.log('Paystack account validation response:', data);
    
            // Check if Paystack returns a successful status
            if (data.status) {
                console.log(`Account verified: ${data.data.account_name} (${data.data.account_number})`);
                return true;  // Account is valid
            }
    
            console.error('Account validation failed:', data.message);
            return false;  // Account validation failed
    
        } catch (err: any) {
            console.error('Error validating account:', err.response?.data || err.message);
            return false;  // Error occurred during validation
        }
    }

    public static async createPaystackRecipient(userRecord: IPayeePaystackDetail): Promise<string | null> {
        try {
            const params = {
                type: "nuban",
                name: userRecord.accountName,
                account_number: userRecord.accountNumber,
                bank_code: userRecord.bankCode,
                currency: "NGN",
            }

            const { data } = await axios.post(`https://api.paystack.co/transferrecipient`, params, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Paystack creation recepient:', data);
    
            // Verify that the amount matches
            if (data && data.status) {
                return data.data.recipient_code
            }
            return null
        } catch (err) {
            return null
        }
    }

    public static async initiatePaystackTransfer(recepient: string, amount: number, message: string): Promise<IPaystackTransferObject | null> {
        try {
            const params = {
                source: "balance",
                reason: message,
                amount: amount * 100, // Convert amount to kobo
                recipient: recepient,
                reference: this.generatePaystackReference(),
                currency: "NGN",
            }

            const record = await axios.post(`https://api.paystack.co/transfer`, params, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            const { data } = record
            console.log('Paystack creation recepient:', data);
    
            // Verify that the amount matches
            if (data && data.status) {
                return {
                    reference: params.reference,
                    transferCode: data.data.transfer_code,
                }
            }
            return null
        } catch (err) {
            console.log(err);
            return null
        }
    }
    
}

export default PaymentService;