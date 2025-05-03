"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/lib/api";  // Import the API function
import { useAuthStore } from "@/store/authStore";  // Import the authStore

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const { setForgotPasswordStatus } = useAuthStore();  // For managing status

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const res = await forgotPassword(email);
            console.log("Password reset response:", res);
            if (res.success) {
                setForgotPasswordStatus("Password reset link sent.");
                router.push("/auth/reset");
            } else {
                setForgotPasswordStatus(res.message || "Unknown error.");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            setForgotPasswordStatus("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AuthLayout header="Forgot Password">
                <AuthInput
                    inputLable="Email"
                    placeholder="user@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className=""
                />
                <Button onClick={handleForgotPassword} disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </Button>
            </AuthLayout>
        </>
    );
}
