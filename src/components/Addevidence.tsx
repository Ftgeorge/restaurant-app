"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = "https://cloud-incident-reporter.onrender.com";

interface AddEvidenceProps {
    onClose: () => void;
    incidentId?: string;
    onSuccess?: () => void; // Add callback for successful submission
}

export default function AddEvidence({ onClose, incidentId, onSuccess }: AddEvidenceProps) {
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        _incident: incidentId || "",
        fileUrl: "",
        fileType: true,
        description: "",
        hash: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Validate form data
    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!formData._incident) {
            errors._incident = "Incident ID is required";
        }
        
        if (!formData.fileUrl) {
            errors.fileUrl = "File URL is required";
        } else if (!isValidUrl(formData.fileUrl)) {
            errors.fileUrl = "Please enter a valid URL";
        }
        
        if (!formData.hash) {
            errors.hash = "Hash is required";
        }
        
        if (!formData.description) {
            errors.description = "Description is required";
        }
        
        return errors;
    };

    // Simple URL validation
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        // Clear field-specific error when user makes changes
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
        
        // Special handling for fileType to convert to boolean
        if (name === "fileType") {
            setFormData(prevData => ({
                ...prevData,
                [name]: value === "true"
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        
        setIsSubmitting(true);

        if (!user?.token) {
            setError("Unauthorized. Please login.");
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Submitting evidence data:', formData);
            
            const response = await axios.post(`${BASE_URL}/api/v1/evidence/create-evidence`, formData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            });
            
            console.log('Evidence submission successful:', response.data);
            
            if (onSuccess) {
                onSuccess();
            }
            
            onClose();
        } catch (err: any) {
            console.error("Error submitting evidence:", err);
            
            // Handle different types of errors
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Response error data:", err.response.data);
                console.error("Response error status:", err.response.status);
                
                if (err.response.data?.errors) {
                    // Handle validation errors from API
                    const apiErrors = err.response.data.errors;
                    const fieldErrorsMap: Record<string, string> = {};
                    
                    // Map API errors to form fields
                    Object.keys(apiErrors).forEach(field => {
                        fieldErrorsMap[field] = apiErrors[field].message || apiErrors[field];
                    });
                    
                    setFieldErrors(fieldErrorsMap);
                } else {
                    // General error message
                    setError(err.response.data?.message || `Server error: ${err.response.status}`);
                }
            } else if (err.request) {
                // The request was made but no response was received
                setError("Network error. Please check your connection and try again.");
            } else {
                // Something happened in setting up the request that triggered an Error
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Evidence</h2>
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
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-gray-700 mb-2">Incident ID *</label>
                        <input
                            type="text"
                            name="_incident"
                            value={formData._incident}
                            onChange={handleChange}
                            className={`w-full p-3 border ${fieldErrors._incident ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {fieldErrors._incident && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors._incident}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">File URL *</label>
                        <input
                            type="text"
                            name="fileUrl"
                            value={formData.fileUrl}
                            onChange={handleChange}
                            className={`w-full p-3 border ${fieldErrors.fileUrl ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {fieldErrors.fileUrl && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.fileUrl}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">File Type</label>
                        <select
                            name="fileType"
                            value={formData.fileType.toString()}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Hash *</label>
                        <input
                            type="text"
                            name="hash"
                            value={formData.hash}
                            onChange={handleChange}
                            className={`w-full p-3 border ${fieldErrors.hash ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                        {fieldErrors.hash && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.hash}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full p-3 border ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        ></textarea>
                        {fieldErrors.description && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Evidence"}
                    </Button>
                </div>
            </form>
        </div>
    );
}