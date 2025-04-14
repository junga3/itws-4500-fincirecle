// src/components/CardsList.tsx
'use client';

import { useState } from 'react';
import { deleteCard } from '@/app/actions/cardActions';
import Link from 'next/link';

interface Card {
    id: string;
    cardName: string;
    userId: string;
}

interface SuccessResponse {
    status: "success";
    data: Card[];
}

interface ErrorResponse {
    status: "fail";
    message: string;
}

type CardsResponse = SuccessResponse | ErrorResponse;

interface CardsListProps {
    cardsResponse: CardsResponse;
    userEmail: string;
}

export default function CardsList({ cardsResponse, userEmail }: CardsListProps) {
    const [cards, setCards] = useState<Card[]>(
        cardsResponse.status === 'success' && Array.isArray(cardsResponse.data) 
        ? cardsResponse.data 
        : []
    );
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    async function handleDeleteCard(cardName: string) {
        if (!confirm(`Are you sure you want to delete the card "${cardName}"?`)) {
            return;
        }
        
        setIsDeleting(cardName);
        
        const formData = new FormData();
        formData.append('userEmail', userEmail);
        formData.append('cardName', cardName);
        
        try {
            const response = await deleteCard(formData) as SuccessResponse | ErrorResponse;
            
            if (response.status === 'success') {
                setMessage({ text: 'Card deleted successfully!', type: 'success' });

                setCards(cards.filter(card => card.cardName !== cardName));
            } else {
                setMessage({ text: response.message || 'Failed to delete card', type: 'error' });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setIsDeleting(null);
        }
    }

    if (cardsResponse.status !== 'success') {
        return (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                Error: {cardsResponse.message || 'Failed to load cards'}
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">You don&apos;t have any cards yet.</p>
                <p className="mt-2">Register a new card to get started!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {message && (
                <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            
            <ul className="divide-y divide-gray-200">
                {cards.map((card) => (
                    <li key={card.id} className="py-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-lg">{card.cardName}</h3>
                        </div>
                        <div className="flex space-x-2">
                            <Link 
                                href={`/transactions/${encodeURIComponent(card.cardName)}`}
                                className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                            >
                                View Transactions
                            </Link>
                            <button
                                onClick={() => handleDeleteCard(card.cardName)}
                                disabled={isDeleting === card.cardName}
                                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 disabled:bg-red-300"
                            >
                                {isDeleting === card.cardName ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}