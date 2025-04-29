import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    header: string;
}

export default function AuthLayout({ children, header }: AuthLayoutProps) {
    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#F0F0F0] px-4">
            <div className="w-full max-w-md bg-white rounded-lg px-6 py-8 shadow-md">
                <h1 className="text-2xl font-bold text-center mb-6">{header}</h1>
                <div className="flex flex-col gap-4">{children}</div>
            </div>
        </div>
    );
}
