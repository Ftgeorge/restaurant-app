"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpForm } from "@/validation/otpSchema";
import { verifyOtp } from "@/lib/api";
import { Button } from "@/components/button";
import AuthLayout from "@/components/layout/auth.layout";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function VerifyOtpScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const { user } = useAuthStore();
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (user?.otp?.code) {
                alert(`Your OTP is: ${user.otp.code}`);
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, []);


    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<OtpForm>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otpCode: "" },
    });

    const otpValue = watch("otpCode");

    const handleChange = (value: string, index: number) => {
        const otpArray = otpValue.split("");
        otpArray[index] = value.slice(-1); // only last character
        const newOtp = otpArray.join("").padEnd(6, "");
        setValue("otpCode", newOtp);
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otpValue[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const onSubmit = async (data: OtpForm) => {
        setLoading(true);
        try {
            const res = await verifyOtp(data.otpCode);
            console.log(res.message);
            router.push("/auth/login");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout header="Verify OTP">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex justify-center gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                if (el) inputsRef.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otpValue[i] || ""}
                            onChange={(e) => handleChange(e.target.value, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>
                {errors.otpCode && (
                    <p className="text-red-500 text-sm text-center">{errors.otpCode.message}</p>
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify"}
                </Button>
            </form>
        </AuthLayout>
    );
}
