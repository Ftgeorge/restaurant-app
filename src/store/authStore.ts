import { create } from 'zustand';

type User = {
    firstname: string;
    lastname: string;
    email: string;
    token: string;
    _id: string;
    gender?: string;
    image?: string;
    isActive?: boolean;
    createdAt?: string;
    otp?: { code: number; expiresAt: string };
    yearsOfExperience?: number;
    developerTitle?: string;
    developerStack?: string[];
    certifications?: string[];
    portfolioLink?: string;
    cvLink?: string;
};

type AuthStore = {
    user: User | null;  // Allow user to be null
    setUser: (user: User | null) => void;  // Allow setUser to accept null

    // Forgot password & OTP states
    forgotPasswordStatus: string | null;  // e.g., "Email sent successfully" or error messages
    otpStatus: string | null;  // OTP verification status
    setForgotPasswordStatus: (status: string) => void;
    setOtpStatus: (status: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),

    // Forgot password & OTP states
    forgotPasswordStatus: null,
    otpStatus: null,
    setForgotPasswordStatus: (status) => set({ forgotPasswordStatus: status }),
    setOtpStatus: (status) => set({ otpStatus: status }),
}));
