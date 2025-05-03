import { z } from "zod";

export const otpSchema = z.object({
    otpCode: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d+$/, "OTP must be numeric"),
});

export type OtpForm = z.infer<typeof otpSchema>;
