"use client";
import { signOut } from "next-auth/react";

export default function SignOut() {
    return (
        <button 
            className={"text-gray-300 hover:text-white"} 
            onClick={async () => {
            await signOut({ redirectTo: '/' });
            }}>
            Logout
        </button>
    );
    }