"use client";

import { Button } from "@/components/button";
import AuthFooter from "@/components/footer/auth.footer";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import { useRouter } from "next/navigation";

export default function SignInScreen() {
    const router = useRouter()
    const SignUp = () => {
        router.push('/auth/verify')
    }

    return (
        <>
            <AuthLayout header="Sign Up">
                <AuthInput
                    inputLable="Username"
                    placeholder="Jogn Doe"
                    className=""
                />
                <AuthInput
                    inputLable="Email"
                    placeholder="username@gmail.com"
                    className=""
                />
                <AuthInput
                    inputLable="Telephone"
                    placeholder="0000-0000-0000"
                    className=""
                />
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
                <Button onClick={SignUp}>Sign Up</Button>
                <AuthFooter
                    footerMessage="Already have an account?"
                    gotoLink="Log In"
                    href="/auth/login"
                />
            </AuthLayout>
        </>
    );
}
