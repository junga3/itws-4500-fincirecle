// src/app/card/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCards } from '../actions/cardActions';
import CardsList from '@/components/CardsList';
import CardRegistrationForm from '@/components/CardRegistrationForm';
import Link from 'next/link';

export default async function CardPage() {
    const session = await auth();

    if(!session || !session.user || !session.user.email) {
        redirect('/api/auth/signin?callbackUrl=/card');
    }

    const cardsResponse = await getCards();
    
    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link href="/dashboard" className="text-blue-500 hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Card Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Register New Card</h2>
                    <CardRegistrationForm userEmail={session.user.email} />
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Your Cards</h2>
                    <CardsList cardsResponse={cardsResponse} userEmail={session.user.email} />
                </div>
            </div>
        </div>
    );
}