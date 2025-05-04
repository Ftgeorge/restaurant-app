"use client";

import { MdEdit, MdVisibility } from "react-icons/md";
import { useEffect, useRef } from "react";
import { IoMdTrash } from "react-icons/io";
import { createPortal } from "react-dom";

interface ActionDropdownProps {
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onView?: () => void; // Optional view handler
}

export default function ActionDropdown({ 
    position, 
    onClose, 
    onEdit, 
    onDelete,
    onView 
}: ActionDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Adjust position to keep dropdown within viewport
    const adjustedPosition = {
        top: position.top,
        left: Math.min(position.left, window.innerWidth - 160) // 160px is dropdown width + some margin
    };
    
    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        
        // Add event listener
        document.addEventListener("mousedown", handleClickOutside);
        
        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);
    
    // Handle the edit function
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Edit button clicked");
        onEdit();
        onClose();
    };
    
    // Handle the delete function
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Delete button clicked");
        onDelete();
        onClose();
    };
    
    // Handle the view function
    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("View button clicked");
        if (onView) {
            onView();
        }
        onClose();
    };
    
    // Using createPortal with null check for SSR compatibility
    if (typeof document === 'undefined') {
        return null;
    }
    
    return createPortal(
        <div 
            ref={dropdownRef}
            className="fixed w-40 bg-white border border-gray-200 shadow-md rounded-md z-50 p-1"
            style={{ 
                top: adjustedPosition.top, 
                left: adjustedPosition.left 
            }}
        >
            {onView && (
                <button 
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-sm" 
                    onClick={handleView}
                >
                    <MdVisibility className="text-gray-500" size={18} /> View
                </button>
            )}
            
            <button
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-sm"
                onClick={handleEdit}
            >
                <MdEdit className="text-gray-500" size={18} /> Edit
            </button>
            
            <button 
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500 rounded-sm"
                onClick={handleDelete}
            >
                <IoMdTrash className="text-red-500" size={18} /> Delete
            </button>
        </div>,
        document.body
    );
}