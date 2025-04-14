// src/app/card/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCards } from '../actions/cardActions';
import CardsList from '@/components/CardsList';
import CardRegistrationForm from '@/components/CardRegistrationForm';

export default async function CardPage() {
    const session = await auth();

    if(!session || !session.user || !session.user.email) {
        redirect('/api/auth/signin?callbackUrl=/card');
    }

    const cardsResponse = await getCards();
    
    return (
        <div className="container mx-auto p-4">
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