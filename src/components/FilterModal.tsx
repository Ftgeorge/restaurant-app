"use client";

import { useEffect, useRef } from "react";

interface FilterModalProps {
    position: { top: number; left: number };
    onClose: () => void;
}

export default function FilterModal({ position, onClose }: FilterModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={modalRef}
            className="absolute z-50 bg-white shadow-lg rounded-md p-6 w-72"
            style={{ top: position.top, left: position.left }}
        >
            <div className="flex gap-2 items-center">
                <div className="bg-blue-500 h-8 w-3 rounded" />
                <h1 className="font-semibold text-xl text-black">Filter</h1>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Location</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Select location</option>
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Enugu</option>
                    <option>Kano</option>
                    <option>Port Harcourt</option>
                    <option>Ibadan</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Ratings</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Select rating</option>
                    <option>5.0</option>
                    <option>4.5</option>
                    <option>4.0</option>
                    <option>3.5</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Select status</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
            <div className="flex justify-between">
                <button
                    onClick={onClose}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
                >
                    Clear Filter
                </button>
                <button
                    onClick={onClose}
                    className="px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Save Filter
                </button>
            </div>
        </div>
    );
}
