// components/input/auth.select.tsx
import { forwardRef, SelectHTMLAttributes } from "react";

interface AuthSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    options: string[];
}

const AuthSelect = forwardRef<HTMLSelectElement, AuthSelectProps>(
    ({ label, error, options, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1">
                <label className="font-medium text-sm">{label}</label>
                <select
                    ref={ref}
                    {...props}
                    className="h-12 px-4 border rounded"
                >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
                {error && <span className="text-red-500 text-xs">{error}</span>}
            </div>
        );
    }
);

AuthSelect.displayName = "AuthSelect";
export default AuthSelect;
