// src/components/CardRegistrationForm.tsx
'use client';

import { useState } from 'react';
import { registerCard } from '@/app/actions/cardActions';

interface CardRegistrationFormProps {
    userEmail: string;
}

export default function CardRegistrationForm({ userEmail }: CardRegistrationFormProps) {
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        setMessage(null);
        
        try {
            const response = await registerCard(formData);
            
            if (response.status === 'success') {
                setMessage({ text: 'Card registered successfully!', type: 'success' });

                const form = document.getElementById('card-form') as HTMLFormElement;
                form.reset();

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setMessage({ text: response.status || 'Failed to register card', type: 'error' });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage({ text: 'An error occurred. Please try again.', type: 'error',  });
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
            
            <form id="card-form" action={handleSubmit} className="space-y-4">
                <input type="hidden" name="userEmail" value={userEmail} />
                
                <div>
                    <label className="block text-gray-700 mb-2" htmlFor="cardName">
                        Card Name
                    </label>
                    <input
                        id="cardName"
                        name="cardName"
                        type="text"
                        placeholder="Enter card name (e.g., My Visa Card)"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-700 disabled:bg-blue-300"
                >
                    {isSubmitting ? 'Registering...' : 'Register Card'}
                </button>
            </form>
        </div>
    );
}