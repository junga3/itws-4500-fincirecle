import RegisterForm from '@/components/RegisterForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const session = await auth();
  
  // Redirect to profile if already logged in
  if (session) {
    redirect('/profile');
  }
  
  return (
    <div>
      <RegisterForm />
    </div>
  );
}