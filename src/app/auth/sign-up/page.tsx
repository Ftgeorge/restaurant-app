"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/validation/signupSchema";
import { z } from "zod";
import { signUpUser } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/button";
import AuthFooter from "@/components/footer/auth.footer";
import AuthInput from "@/components/input/auth.input";
import AuthLayout from "@/components/layout/auth.layout";
import AuthSelect from "@/components/select/AuthSelect";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignInScreen() {
    const { setUser } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpForm) => {
        setLoading(true);
        try {
            const { confirmPassword, ...payload } = data;
            const res = await signUpUser(payload);

            const userFromResponse = res.data.user;
            const token = res.token;

            setUser({
                ...userFromResponse,
                token,
            });

            console.log("Signup response:", res);
            router.push("/auth/verify");

        } catch (error) {
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <AuthLayout header="Sign Up">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <AuthInput
                    inputLable="First Name"
                    placeholder="John"
                    {...register("firstname")}
                    error={errors.firstname?.message}
                />
                <AuthInput
                    inputLable="Last Name"
                    placeholder="Doe"
                    {...register("lastname")}
                    error={errors.lastname?.message}
                />
                <AuthInput
                    inputLable="Email"
                    placeholder="username@gmail.com"
                    {...register("email")}
                    error={errors.email?.message}
                />
                <AuthInput
                    inputLable="Password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                    error={errors.password?.message}
                />

                <AuthInput
                    inputLable="Re-Enter Password"
                    type="password"
                    placeholder="********"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                />

                <AuthSelect
                    label="Gender"
                    options={["Male", "Female"]}
                    {...register("gender")}
                    error={errors.gender?.message} />
                <AuthSelect
                    label="User Type"
                    options={["investigator", "admin", "reporter"]}
                    {...register("userType")}
                    error={errors.userType?.message}
                />
                <Button type="submit" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </Button>
            </form>
            <AuthFooter
                footerMessage="Already have an account?"
                gotoLink="Log In"
                href="/auth/login"
            />
        </AuthLayout>
    );
}
