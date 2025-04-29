import { ReactNode } from "react"

interface SidebarProviderProps {
    children: ReactNode;
    isOpen: boolean;
    onToggleSidebar: () => void;
}

export default function SidebarProvider({
    children, isOpen, onToggleSidebar
}: SidebarProviderProps) {
    return (
        <>
            <div className="w-full h-full flex flex-1 bg-red-200">
                <aside className={`h-screen fixed left-0 top-0 z-10 border-r border-r-[#E3E2D9] bg-[#F8F7F2] flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "w-64 p-6" : "w-20 p-4 items-center"}`}>
                    sd
                </aside>
                {children}
            </div>
        </>
    )
}