"use client";

import { ReactNode, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
    MdAssignment,
    MdReport,
    MdFolder,
    MdWarning,
    MdChatBubbleOutline,
    MdPersonOutline,
} from "react-icons/md";

interface SidebarProviderProps {
    children: ReactNode;
    isOpen: boolean;
    onToggleSidebar: () => void;
}

const navItems = [
    { label: "Audit", icon: <MdAssignment size={20} /> },
    { label: "Report", icon: <MdReport size={20} /> },
    { label: "Evidence", icon: <MdFolder size={20} /> },
    { label: "Incidence", icon: <MdWarning size={20} /> },
];

export default function SidebarProvider({
    children,
    isOpen,
    onToggleSidebar,
}: SidebarProviderProps) {
    const [currentPage, setCurrentPage] = useState("Audit");

    return (
        <div className="flex w-full h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-72 h-full bg-white shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setCurrentPage(item.label)}
                            className={`flex items-center w-full p-3 rounded-md text-left hover:bg-blue-600 transition ${currentPage === item.label ? "bg-blue-500 text-white font-medium" : ""
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <div className="h-14 w-full bg-white flex items-center justify-between px-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 h-8 w-3 rounded" />
                        <h1 className="text-lg font-semibold">{currentPage}</h1>
                    </div>
                    <div className="flex items-center gap-8">
                        <MdChatBubbleOutline size={22} className="cursor-pointer" />
                        <IoMdNotificationsOutline size={22} className="cursor-pointer" />
                        <MdPersonOutline size={24} className="cursor-pointer" />
                    </div>
                </div>

                {/* Page Content */}
                <div className="w-full h-full flex-1 bg-gray-50 p-6 overflow-y-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
