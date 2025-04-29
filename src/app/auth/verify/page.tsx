"use client";

import { Button } from "@/app/components/button";
import AuthInput from "@/app/components/input/auth.input";
import AuthLayout from "@/app/components/layout/auth.layout";
import { useRouter } from "next/navigation";

export default function VerifyOtpScreen() {
    const router = useRouter()
    const Verify = () => {
        router.push('/auth/login')
    }
    return (
        <>
            <AuthLayout header="Verify OTP">
                <AuthInput
                    inputLable="OTP"
                    placeholder="John Doe"
                    className=""
                />
                <Button onClick={Verify}>Verify</Button>
            </AuthLayout>
        </>
    );
}
