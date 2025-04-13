// src/components/TransactionForm.tsx
'use client';

import { useState } from 'react';
import { addTransaction } from '@/app/actions/transactionActions';

interface TransactionFormProps {
    cardName: string;
    userEmail: string;
}

export default function TransactionForm({ cardName, userEmail }: TransactionFormProps) {
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);
        
        try {
            const response = await addTransaction(formData);
            
            if (response.status === 'success') {
                setMessage({ text: 'Transaction added successfully!', type: 'success' });

                const form = document.getElementById('transaction-form') as HTMLFormElement;
                form.reset();

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setMessage({ text: response.status || 'Failed to add transaction', type: 'error' });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            
            <form id="transaction-form" action={handleSubmit} className="space-y-4">
                <input type="hidden" name="userEmail" value={userEmail} />
                <input type="hidden" name="cardName" value={cardName} />
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                        Description
                    </label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        placeholder="Enter transaction description"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="amount">
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2">$</span>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full pl-8 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Use positive values for income, negative for expenses
                    </p>
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-700 disabled:bg-blue-300"
                >
                    {isSubmitting ? 'Adding...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    );
}