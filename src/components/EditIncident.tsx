"use client";

import { useState } from "react";
import { updateIncident } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Props {
    incident: {
        _id: string;
        description: string;
        location?: { latitude: number; longitude: number };
        tag: string[];
    };
    onClose: () => void;
}

export default function IncidentEditForm({ incident, onClose }: Props) {
    const { user } = useAuthStore();
    const [description, setDescription] = useState(incident.description);
    const [latitude, setLatitude] = useState(incident.location?.latitude ?? 0);
    const [longitude, setLongitude] = useState(incident.location?.longitude ?? 0);
    const [tagString, setTagString] = useState(incident.tag.join(", "));

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.token) return;

        const payload = {
            description,
            location: { latitude, longitude },
            tag: tagString.split(",").map((t) => t.trim()),
        };

        try {
            setLoading(true);
            await updateIncident(incident._id, payload, user.token);
            setSuccess(true);
            setTimeout(() => onClose(), 1000); // auto-close after success
        } catch (err: any) {
            console.error("Update failed:", err);
            setError("Failed to update incident");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-md p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Edit Incident</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="w-full border rounded p-2"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input
                        type="number"
                        className="w-full border rounded p-2"
                        value={latitude}
                        onChange={(e) => setLatitude(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input
                        type="number"
                        className="w-full border rounded p-2"
                        value={longitude}
                        onChange={(e) => setLongitude(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={tagString}
                        onChange={(e) => setTagString(e.target.value)}
                    />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-600">Incident updated!</p>}
                <div className="flex justify-between">
                    <button type="button" onClick={onClose} className="text-sm text-gray-500">Cancel</button>
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                        {loading ? "Saving..." : "Update Incident"}
                    </button>
                </div>
            </form>
        </div>
    );
}
