"use client";

import { useState } from "react";
import { updateAudit } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Props {
    Audit: {
        _id: string;
        quantity: string;
        location: string;
    };
    onClose: () => void;
}

export default function AuditEditForm({ Audit, onClose }: Props) {
    const { user } = useAuthStore();
    const [quantity, setQuantity] = useState(Audit.quantity);
    const [location, setLocation] = useState(Audit.location);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token) return;

        const payload = {
            quantity,
            location,
        };

        try {
            setLoading(true);
            await updateAudit(Audit._id, payload, user.token);
            setSuccess(true);
            setTimeout(() => onClose(), 1000);
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update audit.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Edit Audit</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">Audit updated successfully!</p>}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:underline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Saving..." : "Update Audit"}
                    </button>
                </div>
            </form>
        </div>
    );
}
