"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";


const BASE_URL = "https://cloud-incident-reporter.onrender.com";
export default function AddAudit({ onClose }: { onClose: () => void }) {
    const { user } = useAuthStore();

    // Form state
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!user?.token) {
            alert("Unauthorized. Please login.");
            return;
        }

        const payload = {
            _product: productId,
            quantity,
            location
        };

        setIsSubmitting(true);

        try {
            await axios.post(`${BASE_URL}/api/v1/audit/create-audit`,payload, {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            });
            alert("Audit submitted successfully.");
            onClose();
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to create audit");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Product Audit</h2>
                <button onClick={onClose} className="text-blue-600 hover:underline">Back</button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Product ID</label>
                    <input
                        type="text"
                        placeholder="Product ID"
                        className="border border-gray-300 rounded p-3"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Quantity</label>
                    <input
                        type="text"
                        placeholder="Quantity"
                        className="border border-gray-300 rounded p-3"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-600">Location</label>
                    <input
                        type="text"
                        placeholder="Location"
                        className="border border-gray-300 rounded p-3"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`mt-6 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold px-6 py-3 rounded self-end`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Audit'}
                </button>
            </div>
        </div>
    );
}