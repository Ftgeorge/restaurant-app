import { create } from "zustand";

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
  user: User | null;
  setUser: (user: User | null) => void;
  forgotPasswordStatus: string | null;
  otpStatus: string | null;
  setForgotPasswordStatus: (status: string) => void;
  setOtpStatus: (status: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },
  forgotPasswordStatus: null,
  otpStatus: null,
  setForgotPasswordStatus: (status) => set({ forgotPasswordStatus: status }),
  setOtpStatus: (status) => set({ otpStatus: status }),
}));
