import Link from "next/link"

export default function LoginScreen() {
    return (
        <>
            <h1>Login Screen</h1>
            <Link href="/auth/sign-up">
                <h1>Sign Up here</h1>
            </Link>
        </>
    );
}
