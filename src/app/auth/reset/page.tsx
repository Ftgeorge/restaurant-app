"use client";

import { Button } from "@/components/button";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import { useRouter } from "next/navigation";

export default function PasswordResetScreen() {
    const router = useRouter()
    const Reset = () => {
        router.push('/auth/login')
    }
    return (
        <>
            <AuthLayout header="Reset Password">
                <AuthInput
                    inputLable="Password"
                    placeholder="********"
                    className=""
                />
                <AuthInput
                    inputLable="Re-Enter Password"
                    placeholder="********"
                    className=""
                />
                <Button onClick={Reset}>Reset</Button>
            </AuthLayout>
        </>
    );
}
