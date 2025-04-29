interface AuthInputProps {
    inputLable: string;
    className?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    id?: string;
}

export default function AuthInput({
    inputLable,
    className = "",
    placeholder,
    value,
    onChange,
    type = "text",
    id,
}: AuthInputProps) {
    return (
        <div className="w-full flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-semibold">{inputLable}</label>
            <input
                id={id}
                type={type}
                className={`border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-12 rounded px-3 ${className}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
