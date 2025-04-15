import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-100 w-auto">
        <h1>Page could not be found</h1>
        <Link href="/" className="text-blue-500 hover:underline">Go back to home.</Link>
    </div>
  )
}