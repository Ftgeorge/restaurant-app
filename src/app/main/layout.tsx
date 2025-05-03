"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { MdPersonOutline } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdAssignment, MdReport, MdFolder, MdWarning, MdChatBubbleOutline } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import ProfileModal from "@/components/modal/ProfileModal";

const navItems = [
    { label: "Incident", icon: <MdWarning size={20} />, path: "/main/incident" },
    { label: "Evidence", icon: <MdFolder size={20} />, path: "/main/evidence" },
    { label: "Audit", icon: <MdAssignment size={20} />, path: "/main/audit" },
    { label: "Report", icon: <MdReport size={20} />, path: "/main/report" },
];

export default function SidebarProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, setUser } = useAuthStore();
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        const token = user?.token || localStorage.getItem("token");
        console.log("Token:", token); // Check if the token is present
        if (!token) return;
    
        (async () => {
            try {
                console.log("Fetching profile...");
                const res = await getProfile(token);
                console.log("Profile Response:", res); // Log the profile response
                if (res.success) {
                    setUser({
                        ...res.data,
                        token,
                    });
                } else {
                    console.error("Profile fetch unsuccessful:", res);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            }
        })();
    }, []);
    

    return (
        <div className="flex w-full h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-72 h-full bg-white p-4">
                <div className="flex w-full items-center justify-between mb-6 text-xl">
                    <h2 className="font-semibold">Dashboard</h2>
                    <GiHamburgerMenu className="text-blue-500" />
                </div>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className={`text-gray-600 flex items-center w-full p-3 rounded-md text-left hover:text-blue-600 transition ${pathname === item.path
                                ? "bg-blue-500 hover:text-white text-white font-medium"
                                : ""
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
                        <h1 className="text-lg font-semibold capitalize">
                            {navItems.find((item) => item.path === pathname)?.label || ""}
                        </h1>
                    </div>
                    <div className="flex items-center gap-8">
                        <MdChatBubbleOutline size={22} className="cursor-pointer" />
                        <IoMdNotificationsOutline size={22} className="cursor-pointer" />

                        <div onClick={() => {
                            setShowProfileModal(true);
                            console.log('Profile Modal Opened:', showProfileModal); // Add this log
                        }}>
                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt="profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full object-cover cursor-pointer"
                                />
                            ) : (
                                <MdPersonOutline size={24} className="cursor-pointer" />
                            )}
                        </div>


                        <ProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />

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
