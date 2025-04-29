"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import AuthFooter from "@/components/footer/auth.footer";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        router.push("/main/audit");
    };

    return (
        <AuthLayout header="Login">
            <AuthInput
                inputLable="Username"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <AuthInput
                inputLable="Password"
                placeholder="********"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="w-full flex justify-end">
                <Link href="/auth/forgot" className="text-sm text-blue-500 hover:text-blue-600 font-semibold hover:underline">
                    Forgot Password?
                </Link>
            </div>
            <Button onClick={handleLogin}>Login</Button>
            <AuthFooter
                footerMessage="Don't have an account?"
                gotoLink="Sign Up"
                href="/auth/sign-up"
            />
        </AuthLayout>
    );
}
