import { ReactNode } from "react"

interface AuthLayoutProps {
    children: ReactNode;
    header: string;
}

export default function AuthLayout({ children, header }: AuthLayoutProps) {
    return (
        <>
            <div className="w-full h-screen flex flex-1 justify-center items-center bg-[#F0F0F0]">
                <div className="w-2/9 bg-white rounded px-4 py-5 flex flex-col justify-center items-center">
                    <h1 className="text-xl font-semibold pb-5">{header}</h1>
                    <div className="flex flex-col gap-5 w-full">
                    {children}
                    </div>
                </div>
            </div>
        </>
    )
}
