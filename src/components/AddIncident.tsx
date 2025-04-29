"use client";

import { useState } from "react";

export default function AddIncident({ onClose }: { onClose: () => void }) {
    const [incidentImage, setIncidentImage] = useState<File | null>(null);
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [nidFile, setNidFile] = useState<File | null>(null);

    return (
        <div className="w-full h-full p-6 flex flex-col gap-6 bg-white">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Add Incident</h2>
                <button onClick={onClose} className="text-blue-600 hover:underline">Back</button>
            </div>

            {/* Incident Image Section */}
            <div className="flex gap-4 items-center">
                <div className="border-2 border-dashed border-gray-400 rounded-md p-8 text-center text-gray-500 w-64 h-40 flex items-center justify-center">
                    {incidentImage ? incidentImage.name : "Incident Image"}
                </div>
                <div className="flex flex-col gap-2">
                    <input
                        id="incidentImage"
                        type="file"
                        className="hidden"
                        onChange={(e) => setIncidentImage(e.target.files?.[0] || null)}
                    />
                    <label
                        htmlFor="incidentImage"
                        className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                    >
                        + Incident Image
                    </label>
                    {incidentImage && (
                        <button
                            onClick={() => setIncidentImage(null)}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    placeholder="Incident Name"
                    className="border border-gray-300 rounded p-3"
                />
                <input
                    placeholder="Representative Name"
                    className="border border-gray-300 rounded p-3"
                />
                <input
                    placeholder="Phone Number"
                    className="border border-gray-300 rounded p-3"
                />

                {/* Business License Upload */}
                <div className="border border-gray-300 rounded p-3 flex items-center justify-between">
                    <span>{licenseFile?.name || "Upload Business License"}</span>
                    <label className="text-blue-600 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                        />
                        Upload
                    </label>
                </div>

                {/* Owner NID Upload */}
                <div className="border border-gray-300 rounded p-3 flex items-center justify-between">
                    <span>{nidFile?.name || "Upload Owner NID"}</span>
                    <label className="text-blue-600 cursor-pointer">
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setNidFile(e.target.files?.[0] || null)}
                        />
                        Upload
                    </label>
                </div>

                {/* Dropdowns Row */}
                <div className="flex gap-4 col-span-2">
                    <select className="border border-gray-300 rounded p-3 w-full">
                        <option>Established</option>
                        <option>2020</option>
                        <option>2021</option>
                    </select>
                    <select className="border border-gray-300 rounded p-3 w-full">
                        <option>Working Period</option>
                        <option>Morning</option>
                        <option>Evening</option>
                    </select>
                    <select className="border border-gray-300 rounded p-3 w-full">
                        <option>Size</option>
                        <option>Small</option>
                        <option>Large</option>
                    </select>
                </div>

                {/* Location Textarea */}
                <textarea
                    placeholder="Location"
                    rows={4}
                    className="border border-gray-300 rounded p-3 col-span-2"
                ></textarea>
            </div>

            {/* Submit Button */}
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded w-fit self-end">
                Add Restaurant
            </button>
        </div>
    );
}
