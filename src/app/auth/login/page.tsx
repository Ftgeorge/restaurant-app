"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import AuthFooter from "@/components/footer/auth.footer";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
    const router = useRouter();
    const { setUser } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            // Clear the store before setting new user data
            setUser(null);

            const res = await loginUser({ email, password });

            if (res.success) {
                const user = res.data.user;
                const token = res.token;

                // Store the new user data in the store
                setUser({
                    ...user,
                    token,
                });

                router.push("/main/incident");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.error || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout header="Login">
            <AuthInput
                inputLable="Email"
                placeholder="John@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <AuthInput
                inputLable="Password"
                placeholder="********"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="w-full flex justify-end">
                <Link href="/auth/forgot" className="text-sm text-blue-500 hover:text-blue-600 font-semibold hover:underline">
                    Forgot Password?
                </Link>
            </div>
            <Button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </Button>
            <AuthFooter
                footerMessage="Don't have an account?"
                gotoLink="Sign Up"
                href="/auth/sign-up"
            />
        </AuthLayout>
    );
}
