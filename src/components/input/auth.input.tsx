import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    inputLable: string;
    error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ inputLable, type = "text", error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPasswordField = type === "password";

        return (
            <div className="flex flex-col gap-1 relative">
                <label className="font-medium text-sm">{inputLable}</label>
                <input
                    ref={ref}
                    type={isPasswordField ? (showPassword ? "text" : "password") : type}
                    {...props}
                    className="h-12 px-4 border rounded pr-10"
                />
                {isPasswordField && (
                    <div
                        className="absolute right-3 top-9 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                        )}
                    </div>
                )}
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";
export default AuthInput;
