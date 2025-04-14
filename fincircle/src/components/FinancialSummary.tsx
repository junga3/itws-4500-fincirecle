// src/components/FinancialSummary.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTransactions } from '@/app/actions/transactionActions';

interface Card {
    id: string;
    cardName: string;
    userId: string;
}

interface Transaction {
    id: string;
    amount: number;
    description: string;
    timestamp: string;
    cardId: string;
    cardName?: string;
}

interface CardWithTransactions extends Card {
    transactions: Transaction[];
    balance: number;
}

interface FinancialSummaryProps {
    cards: Card[];
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

export default function FinancialSummary({ cards }: FinancialSummaryProps) {
    const [cardsWithTransactions, setCardsWithTransactions] = useState<CardWithTransactions[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalBalance, setTotalBalance] = useState(0);
    const [lastTransactions, setLastTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        async function fetchAllTransactions() {
            if (cards.length === 0) {
                setLoading(false);
                return;
            }
            
            const cardsWithTransactionsData: CardWithTransactions[] = [];
            let allTransactions: Transaction[] = [];
            let calculatedTotal = 0;
            
            for (const card of cards) {
                const formData = new FormData();
                formData.append('cardName', card.cardName);
                
                try {
                    const response = await getTransactions(formData) as ActionResponse;
                    
                    if (response.status === 'success') {

                        const transactionsWithCardName = response.data.map(t => ({
                            ...t,
                            cardName: card.cardName,
                        }));
                        
                        const cardBalance = transactionsWithCardName.reduce((sum, t) => sum + t.amount, 0);
                        
                        calculatedTotal += cardBalance;
                        allTransactions = [...allTransactions, ...transactionsWithCardName];
                        
                        cardsWithTransactionsData.push({
                            ...card,
                            transactions: transactionsWithCardName,
                            balance: cardBalance
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching transactions for card ${card.cardName}:`, error);
                }
            }
            
            allTransactions.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            
            setCardsWithTransactions(cardsWithTransactionsData);
            setTotalBalance(calculatedTotal);
            setLastTransactions(allTransactions.slice(0, 5));
            setLoading(false);
        }
        
        fetchAllTransactions();
    }, [cards]);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-center">Loading financial summary...</p>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
                <p className="text-gray-600">You don&apos;t have any cards yet. Create a card to start tracking your finances!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
            
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Total Balance</h3>
                <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalBalance.toFixed(2)}
                </p>
            </div>
            
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Card Balances</h3>
                <div className="space-y-2">
                    {cardsWithTransactions.map(card => (
                        <div key={card.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="font-medium">{card.cardName}</span>
                            <span className={`font-semibold ${card.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${card.balance.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-medium mb-2">Recent Transactions</h3>
                {lastTransactions.length > 0 ? (
                    <div className="space-y-2">
                        {lastTransactions.map(transaction => {
                            const date = new Date(transaction.timestamp);
                            const formattedDate = date.toLocaleDateString();
                            
                            return (
                                <div key={transaction.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-sm text-gray-500">
                                            {formattedDate} • {transaction.cardName}
                                        </p>
                                    </div>
                                    <span className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${transaction.amount.toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-600">No transactions recorded yet.</p>
                )}
            </div>
        </div>
    );
}
