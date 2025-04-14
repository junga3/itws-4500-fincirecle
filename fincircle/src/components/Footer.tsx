import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-gray-300 text-sm">
          © {new Date().getFullYear()} FinCircle. All Rights Reserved.
        </span>
        <div className="flex space-x-4">
          <Link
            href="https://github.com/RPI-ITWS/ITWS4500-S25-DynamicsDevs"
            className="text-gray-300 hover:text-white text-sm"
          >
            GitHub
          </Link>
          <Link
            href="/privacy"
            className="text-gray-300 hover:text-white text-sm"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
