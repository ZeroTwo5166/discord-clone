"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function Home() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/sign-in');
    };

    const handleSignupClick = () => {
        router.push('/sign-up');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
        <h1 className="text-6xl font-bold mb-4">Beta Version</h1>
        <h2 className="text-3xl mb-8">Discord Clone</h2>
        <div className="flex space-x-4">
            <Link href="/sign-in">
            <div 
                className="px-6 py-3 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-purple-500 hover:text-white transition duration-300 cursor-pointer">
                Login
            </div>
            </Link>
            <Link href="/sign-up">
            <div 
                className="px-6 py-3 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-purple-500 hover:text-white transition duration-300 cursor-pointer">
                Sign Up
            </div>
            </Link>
        </div>
        </div>
    );
}
