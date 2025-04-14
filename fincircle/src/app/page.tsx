import Image from 'next/image';
import { auth } from "@/auth";

export default async function HomePage() {

  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-br from-[#1e2939] to-[#1a36b4] py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <Image
            src="/logo.svg"
            alt="FinCircle Logo"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-5xl font-extrabold mb-4">FinCircle</h1>
          <p className="text-xl mb-8">Your Personal Financial Management Tool.</p>
          

          {!isLoggedIn && (
            <div className="flex justify-center gap-4">
              <a
                href="/register"
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300"
              >
                Register
              </a>
              <a
                href="/login"
                className="border border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Login
              </a>
            </div>
          )}
          

          {isLoggedIn && (
            <div className="flex justify-center gap-4">
              <a
                href="/dashboard"
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300"
              >
                Go to Dashboard
              </a>
            </div>
          )}
        </div>
      </header>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Expenses</h2>
              <p className="text-gray-600">
                Monitor your daily spending with intuitive reports and visualizations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Cards</h2>
              <p className="text-gray-600">
                Add cards and visualize their budgets and spending. 
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Achieve Goals</h2>
              <p className="text-gray-600">
                Set financial goals and track your progress with actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose FinCircle?</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            FinCircle provides you with all the tools you need to gain complete control over your finances.
            From tracking expenses to managing budgets and achieving personal financial goals, our platform is designed
            for simplicity and success. Visualize multiple cards across multiple bank accounts and financial institutions. 
          </p>
        </div>
      </section>
    </div>
  );
}
