import Link from "next/link";

interface AuthFooterProps {
    href: string;
    footerMessage: string;
    gotoLink: string;
}

export default function AuthFooter({ href, footerMessage, gotoLink }: AuthFooterProps) {
    return (
        <>
            <div className="flex gap-1 font-semibold text-sm items-center justify-center">
                <h1>{footerMessage}</h1>
                <Link href={href}>
                    <h1 className="text-blue-500 hover:text-blue-600">{gotoLink}</h1>
                </Link>
            </div>
        </>
    )
}
