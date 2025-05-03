"use client";

import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const BASE_URL = "https://cloud-incident-reporter.onrender.com";

export default function AddIncident({ onClose }: { onClose: () => void }) {
    const { user } = useAuthStore();

    // Form state
    const [incidentName, setIncidentName] = useState("");
    const [description, setDescription] = useState("");

    // Optional hardcoded values
    const targetModel = "Device";
    const targetId = "64f7eabc1234567890abcdea";
    const latitude = 6.5244;
    const longitude = 3.3792;
    const tag = ["camera", "security", "urgent"];
    const status = "pending";

    const handleSubmit = async () => {
        if (!user?.token) {
            alert("Unauthorized. Please login.");
            return;
        }

        const payload = {
            title: incidentName,
            targetModel,
            targetId,
            description,
            location: {
                latitude,
                longitude,
            },
            tag,
            status,
        };

        try {
            await axios.post(`${BASE_URL}/api/v1/incident/create-incident`, payload, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
            });

            alert("Incident submitted successfully.");
            onClose();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create incident");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Report Incident</h2>
                <button onClick={onClose} className="text-blue-600 hover:underline">Back</button>
            </div>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Incident Title"
                    className="border border-gray-300 rounded p-3"
                    value={incidentName}
                    onChange={(e) => setIncidentName(e.target.value)}
                />

                <textarea
                    placeholder="Describe the incident..."
                    rows={4}
                    className="border border-gray-300 rounded p-3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/* Optional: Debug section showing hardcoded fields */}
                <div className="mt-4 p-4 bg-gray-50 border rounded text-sm text-gray-600 space-y-1">
                    <p><strong>Target Model:</strong> {targetModel}</p>
                    <p><strong>Target ID:</strong> {targetId}</p>
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Tags:</strong> {tag.join(", ")}</p>
                    <p><strong>Location:</strong> Lat {latitude}, Lng {longitude}</p>
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded self-end"
                >
                    Submit Incident
                </button>
            </div>
        </div>
    );
}
