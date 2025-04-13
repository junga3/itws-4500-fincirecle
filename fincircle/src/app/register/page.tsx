import RegisterForm from '@/components/RegisterForm';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const session = await auth();
  
  if (session) {
    redirect('/profile');
  }
  
  return (
    <div>
      <RegisterForm />
    </div>
  );
}