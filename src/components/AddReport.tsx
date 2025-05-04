"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { MdArrowBack } from "react-icons/md";
// Removed import for createReport as we're using the endpoint directly
import { useAuthStore } from "@/store/authStore";

interface AddReportProps {
    onClose: () => void;
}

export default function AddReport({ onClose }: AddReportProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        _incident: "",
        content: "",
        signed: "",
        signature: "SHA256"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user?.token) {
            setError("You must be logged in to create a report");
            return;
        }

        // Create exact payload structure as required by the API
        const payload = {
            _incident: formData._incident,
            content: formData.content,
            signed: formData.signed,
            signature: formData.signature
        };

        try {
            setLoading(true);
            setError(null);
            
            console.log("Sending payload:", payload); // Debug log
            
            // Use the specific endpoint for creating reports
            const response = await fetch('https://cloud-incident-reporter.onrender.com/api/v1/report/create-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("API Error:", response.status, errorData);
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create report";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center mb-6">
                <button onClick={onClose} className="mr-4">
                    <MdArrowBack size={24} />
                </button>
                <h2 className="text-xl font-semibold">Add New Report</h2>
            </div>

            {success ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Report created successfully!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 shadow-sm">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Incident ID</label>
                        <input
                            type="text"
                            name="_incident"
                            value={formData._incident}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 681710688b9d0587e149014f"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="lambpo for knacks"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Signed By</label>
                        <input
                            type="text"
                            name="signed"
                            value={formData.signed}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. George"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Signature Type</label>
                        <select
                            name="signature"
                            value={formData.signature}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="SHA256">SHA256</option>
                            <option value="SHA512">SHA512</option>
                            <option value="MD5">MD5</option>
                        </select>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="mr-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Report"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}