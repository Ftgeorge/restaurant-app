"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/auth/login");
        }, 3000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex items-center justify-center w-full h-screen bg-white">
            <h1 className="text-4xl font-extrabold text-gray-800 animate-pulse">
                Restaurant App
            </h1>
        </div>
    );
}
