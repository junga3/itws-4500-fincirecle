import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const session = await auth();

    if(!session) {
        redirect('/api/auth/signin?callbackUrl=/profile');
    }

    console.log(session.user);
    
    return (
        <>
            <h1>Profile</h1>
            <p>Welcome {session.user?.name}!</p>
            <p>Your email is {session.user?.email}</p>
            <Link href="/card">Test Link</Link>
        </>
    );
}