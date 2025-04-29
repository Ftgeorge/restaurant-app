"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashScreen() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push('/auth/login');
        }, 3000);
    }, [router]);
    return (
        <div className="w-full h-screen flex flex-1 justify-center items-center">
            <h1 className="text-3xl font-bold">Restaurant App</h1>
        </div>
    );
}