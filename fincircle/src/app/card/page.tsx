import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getCards, registerCard } from '../actions/cardActions';

export default async function ProfilePage() {
    const session = await auth();

    if(!session || !session.user || !session.user.email) {
        redirect('/api/auth/signin?callbackUrl=/profile');
    }

    const data = await getCards();
    console.log("Cards data:", data);
    
    return (
        <>
            <form action={async (formData: FormData) => { "use server"; const response = await registerCard(formData); console.log(response); }} method="POST">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="userEmail">
                        User Email
                    </label>
                    <input
                        id="userEmail"
                        name="userEmail"
                        type="email"
                        defaultValue={session.user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="cardName">
                        Card Name
                    </label>
                    <input
                        id="cardName"
                        name="cardName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
                >
                    Register Card
                </button>

            </form>
        </>
    );
}