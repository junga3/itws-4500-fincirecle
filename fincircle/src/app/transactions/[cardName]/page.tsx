// src/app/transactions/[cardName]/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import TransactionForm from '@/components/TransactionForm';
import TransactionsList from '@/components/TransactionsList';

export default async function TransactionsPage({ params }: { params: { cardName: string } }) {
    const session = await auth();

    if(!session || !session.user || !session.user.email) {
        redirect('/api/auth/signin?callbackUrl=/transactions');
    }

    const cardName = decodeURIComponent(params.cardName);
    
    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link href="/card" className="text-blue-500 hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Cards
                </Link>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Transactions for {cardName}</h1>
            <p className="mb-6 text-gray-600">Manage your transactions for this card</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Add New Transaction</h2>
                    <TransactionForm cardName={cardName} userEmail={session.user.email} />
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                    <TransactionsList cardName={cardName} userEmail={session.user.email} />
                </div>
            </div>
        </div>
    );
}