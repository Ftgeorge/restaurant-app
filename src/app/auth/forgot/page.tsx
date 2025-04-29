"use client";

import { Button } from "@/components/button";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
    const router = useRouter()
        const Verify = () => {
            router.push('/auth/reset')
        }
    return (
        <>
            <AuthLayout header="Forgot Password">
                <AuthInput
                    inputLable="Email"
                    placeholder="user@email.com"
                    className=""
                />
                <Button onClick={Verify}>Send</Button>
            </AuthLayout>
        </>
    );
}
