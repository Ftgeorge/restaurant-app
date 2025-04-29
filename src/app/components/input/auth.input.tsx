interface AuthInputProps {
    inputLable: string;
    className?: string;
    placeholder: string;
    value?: string;
    id?: string;
}

export default function AuthInput({ inputLable, className, placeholder, value, id }: AuthInputProps) {
    return (
        <>
            <div className="w-full flex flex-col gap-1">
                <h1 className="text-sm font-semibold">{inputLable}</h1>
                <input
                    className={`${className} border border-gray-200 w-full focused:border-0 h-12 rounded px-2`}
                    placeholder={placeholder}
                    value={value}
                    id={id}
                />
            </div>
        </>
    )
}
