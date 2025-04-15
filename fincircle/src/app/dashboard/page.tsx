import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCards } from '../actions/cardActions';
import FinancialSummary from '@/components/FinancialSummary';

export default async function ProfilePage() {
    const session = await auth();

    if(!session || !session.user) {
        redirect('/api/auth/signin?callbackUrl=/dashboard');
    }

    const cardsResponse = await getCards();
    const cards = cardsResponse.status === 'success' && Array.isArray(cardsResponse.data) 
        ? cardsResponse.data 
        : [];
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}!</h1>
            <p className="text-gray-600 mb-6">Your FinCircle dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Account Info</h2>
                    <p className="mb-2"><span className="font-medium">Name:</span> {session.user.name}</p>
                    <p className="mb-2"><span className="font-medium">Email:</span> {session.user.email}</p>
                    <p className="mb-4"><span className="font-medium">Cards:</span> {cards.length}</p>
                    
                    <Link 
                        href="/card" 
                        className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Manage Cards
                    </Link>
                </div>
                
                <div className="md:col-span-2">
                    <FinancialSummary cards={cards} />
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link 
                        href="/card" 
                        className="bg-blue-100 text-blue-800 p-4 rounded hover:bg-blue-200 transition flex flex-col items-center text-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Manage Cards</span>
                        <span className="text-sm">Create or edit your cards</span>
                    </Link>
                    
                    {cards.length > 0 && (
                        <Link 
                            href={`/transactions/${encodeURIComponent(cards[0].cardName)}`}
                            className="bg-green-100 text-green-800 p-4 rounded hover:bg-green-200 transition flex flex-col items-center text-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Enter Transactions</span>
                            <span className="text-sm">Add transactions to {cards[0].cardName}</span>
                        </Link>
                    )}
                    
                    <div className="bg-purple-100 text-purple-800 p-4 rounded hover:bg-purple-200 transition flex flex-col items-center text-center cursor-pointer">
                        <Link href="/reports" className="flex flex-col items-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">View Reports</span>
                            <span className="text-sm">View spending habits.</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}