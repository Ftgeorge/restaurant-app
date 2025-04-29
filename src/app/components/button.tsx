import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void
}

function Button({ children, className, onClick }: ButtonProps) {
    return (
        <button onClick={onClick} className={`h-12 w-full rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center cursor-pointer ${className}`}>
            {children}
        </button>
    );
}
export { Button }