"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { MdClose } from "react-icons/md";

interface Evidence {
    _id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    description: string;
    hash: string;
    status: string;
    createdAt: string;
}

interface EditEvidenceProps {
    evidence: Evidence;
    onClose: () => void;
    onSave: (data: any) => void;
}

export default function EvidenceEditForm({ evidence, onClose, onSave }: EditEvidenceProps) {
    const [formData, setFormData] = useState({
        fileType: evidence.fileType || "",
        description: evidence.description || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await onSave(formData);
        } catch (error) {
            console.error("Failed to update evidence:", error);
            setError("Failed to update evidence. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Evidence</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                    <MdClose size={24} />
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block text-gray-700 mb-2">File Type *</label>
                        <input
                            type="text"
                            name="fileType"
                            value={formData.fileType}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-gray-700 mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <Button 
                        type="button" 
                        
                        onClick={onClose} 
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}