import { Button } from "@/app/components/button";
import AuthFooter from "@/app/components/footer/auth.footer";
import AuthInput from "@/app/components/input/auth.input";
import AuthLayout from "@/app/components/layout/auth.layout"
import Link from "next/link"

export default function LoginScreen() {
    return (
        <>
            <AuthLayout header="Login">
                <AuthInput
                    inputLable="Username"
                    placeholder="John Doe"
                    className=""
                />
                <AuthInput
                    inputLable="Password"
                    placeholder="********"
                    className=""
                />
                <Link href="/auth/forgot" className="w-full flex items-center justify-end">
                    <h1 className="text-blue-500 hover:text-blue-600 font-semibold text-sm hover:underline">Forgot Password?</h1>
                </Link>
                <Button>Login</Button>
                <AuthFooter
                    footerMessage="Don't have an account?"
                    gotoLink="Sign Up"
                    href="/auth/sign-up"
                />
            </AuthLayout>
        </>
    );
}
