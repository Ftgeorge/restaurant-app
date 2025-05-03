import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
}

function Button({ children, className = "", ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={`h-12 w-full rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center justify-center cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
}

export { Button };
