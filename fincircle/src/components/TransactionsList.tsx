// src/components/TransactionsList.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTransactions, deleteTransaction } from '@/app/actions/transactionActions';

interface Transaction {
    id: string;
    timestamp: string;
    amount: number;
    description: string;
    cardId: string;
}

interface TransactionsListProps {
    cardName: string;
    userEmail: string;
}

interface SuccessResponse {
    status: "success";
    data: Transaction[];
}

interface ErrorResponse {
    status: "fail";
    message: string;
}

type ActionResponse = SuccessResponse | ErrorResponse;

export default function TransactionsList({ cardName, userEmail }: TransactionsListProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await getTransactions(cardName) as ActionResponse;
                
                if (response.status === 'success') {
                    setTransactions(response.data);
                } else {
                    setError(response.message || 'Failed to load transactions');
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setError('An error occurred while fetching transactions');
            } finally {
                setLoading(false);
            }
        }
        
        fetchTransactions();
    }, [cardName]);

    async function handleDeleteTransaction(transactionId: string) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        
        setIsDeleting(transactionId);
        
        const formData = new FormData();
        formData.append('userEmail', userEmail);
        formData.append('cardName', cardName);
        formData.append('transactionId', transactionId);
        
        try {
            const response = await deleteTransaction(formData) as ActionResponse;
            
            if (response.status === 'success') {
                setMessage({ text: 'Transaction deleted successfully!', type: 'success' });

                setTransactions(transactions.filter(t => t.id !== transactionId));
            } else {
                setMessage({ text: response.message || 'Failed to delete transaction', type: 'error' });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setIsDeleting(null);
        }
    }

    if (loading) {
        return <div className="text-center p-4">Loading transactions...</div>;
    }

    if (error) {
        return <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>;
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No transactions found for this card.</p>
                <p className="mt-2">Add your first transaction to get started!</p>
            </div>
        );
    }

    const totalBalance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            
            <div className="mb-6">
                <h3 className="text-lg font-medium">Card Balance</h3>
                <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalBalance.toFixed(2)}
                </p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => {
                            const date = new Date(transaction.timestamp);
                            const formattedDate = date.toLocaleDateString();
                            
                            return (
                                <tr key={transaction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{formattedDate}</td>
                                    <td className="px-6 py-4">{transaction.description}</td>
                                    <td className={`px-6 py-4 ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteTransaction(transaction.id)}
                                            disabled={isDeleting === transaction.id}
                                            className="text-red-600 hover:text-red-900 disabled:text-red-300"
                                        >
                                            {isDeleting === transaction.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}