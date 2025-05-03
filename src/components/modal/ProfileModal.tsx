"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import BasicModal from "./BasicModal";
import { getProfile, setProfile } from "@/lib/api";

export default function ProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { user, setUser } = useAuthStore();
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        image: user?.image || "",
        developerTitle: user?.developerTitle || "",
        yearsOfExperience: user?.yearsOfExperience || 0,
        developerStack: Array.isArray(user?.developerStack) ? user.developerStack : [],
        certifications: Array.isArray(user?.certifications) ? user.certifications : [],
        portfolioLink: user?.portfolioLink || "",
        cvLink: user?.cvLink || "",
    });

    useEffect(() => {
        if (user?.token) {
            (async () => {
                try {
                    const res = await getProfile(user.token);
                    if (res.success) {
                        setUser({
                            ...res.data,
                            token: user.token,
                        });
                        setFormData({
                            image: res.data.image || "",
                            developerTitle: res.data.developerTitle || "",
                            yearsOfExperience: res.data.yearsOfExperience || 0,
                            developerStack: Array.isArray(res.data.developerStack) ? res.data.developerStack : [],
                            certifications: Array.isArray(res.data.certifications) ? res.data.certifications : [],
                            portfolioLink: res.data.portfolioLink || "",
                            cvLink: res.data.cvLink || "",
                        });
                    }
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                }
            })();
        }
    }, [user?.token, setUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "developerStack" || name === "certifications") {
            const arrayValue = value.split(",").map((item) => item.trim()).filter(Boolean);
            setFormData((prevData) => ({
                ...prevData,
                [name]: arrayValue,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Ensure yearsOfExperience is a number
        const updatedFormData = {
            ...formData,
            yearsOfExperience: Number(formData.yearsOfExperience),
        };
    
        console.log("Saving profile with data:", updatedFormData);
    
        try {
            const response = await setProfile(user!.token, updatedFormData);
            if (response.success) {
                // Assuming response.data contains the updated user profile
                const updatedUser = { ...response.data, token: user!.token };
    
                // Update user in the store with the new data
                setUser(updatedUser);
    
                // Optionally, you can fetch the profile again if needed
                const updatedProfile = await getProfile(user!.token);
                if (updatedProfile.success) {
                    // Update user in store again with latest profile data
                    setUser({ ...updatedProfile.data, token: user!.token });
                }
    
                setEditMode(false);
            }
        } catch (error) {
            console.error("Failed to save profile:", error);
        }
    };
    

    useEffect(() => {
        console.log('User in store:', user);
    }, [user]);



    if (!user) return null;

    return (
        <BasicModal open={open} onClose={onClose}>
            <div className="max-w-2xl w-full">
                <h2 className="text-xl font-semibold mb-4">
                    {editMode ? "Edit Profile" : "User Profile"}
                </h2>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        {formData.image && (
                            <Image
                                src={formData.image || "/default-avatar.png"}
                                alt="profile"
                                width={60}
                                height={60}
                                className="rounded-full object-cover"
                            />
                        )}
                        <div>
                            <p className="font-semibold">{user.firstname} {user.lastname}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                    </div>

                    {editMode ? (
                        <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="developerTitle"
                                value={formData.developerTitle}
                                onChange={handleInputChange}
                                placeholder="Developer Title"
                                className="border p-2 rounded"
                            />
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={handleInputChange}
                                placeholder="Years of Experience"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="developerStack"
                                value={formData.developerStack.join(", ")}
                                onChange={handleInputChange}
                                placeholder="Developer Stack (e.g. Node.js, TypeScript)"
                                className="border p-2 rounded col-span-2"
                            />
                            <input
                                type="text"
                                name="certifications"
                                value={formData.certifications.join(", ")}
                                onChange={handleInputChange}
                                placeholder="Certifications"
                                className="border p-2 rounded col-span-2"
                            />
                            <input
                                type="text"
                                name="portfolioLink"
                                value={formData.portfolioLink}
                                onChange={handleInputChange}
                                placeholder="Portfolio Link"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="cvLink"
                                value={formData.cvLink}
                                onChange={handleInputChange}
                                placeholder="CV Link"
                                className="border p-2 rounded"
                            />
                            <div className="col-span-2 mt-4 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="px-4 py-2 rounded border"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Title:</strong> {user.developerTitle || "N/A"}
                            </div>
                            <div>
                                <div>
                                    <strong>Experience:</strong> {user.yearsOfExperience ? user.yearsOfExperience : "N/A"} years
                                </div>
                            </div>
                            <div>
                                <strong>Stack:</strong> {user.developerStack?.length ? user.developerStack.join(", ") : "N/A"}
                            </div>
                            <div>
                                <strong>Certifications:</strong> {user.certifications?.length ? user.certifications.join(", ") : "N/A"}
                            </div>
                            <div>
                                <strong>CV:</strong> {user.cvLink ? <a className="text-blue-500 underline" href={user.cvLink} target="_blank" rel="noopener noreferrer">View</a> : "N/A"}
                            </div>
                            <div>
                                <strong>Portfolio:</strong> {user.portfolioLink ? <a className="text-blue-500 underline" href={user.portfolioLink} target="_blank" rel="noopener noreferrer">View</a> : "N/A"}
                            </div>

                        </div>
                    )}

                    {!editMode && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setEditMode(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </BasicModal>
    );
}
