"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { FiSearch } from "react-icons/fi";
import { RiFileDownloadLine } from "react-icons/ri";
import { MdKeyboardArrowDown, MdMoreVert, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
import ActionDropdown from "@/components/ActionDropdown";
import FilterModal from "@/components/FilterModal";
import { useAuthStore } from "@/store/authStore";
import DeleteConfirmModal from "@/components/modal/DeleteModal";
import axios from "axios";

import EvidenceEditForm from "@/components/EditEvidence";
import AddEvidence from "@/components/Addevidence";

const BASE_URL = "https://cloud-incident-reporter.onrender.com";

// API functions for Evidence
const getEvidence = async (token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v1/evidence/get-evidences`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching evidence:", error.response?.data || error.message);
        throw error;
    }
};

const updateEvidence = async (id: string, data: any, token: string) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/api/v1/evidence/update-evidence/${id}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error updating evidence:", error.response?.data || error.message);
        throw error;
    }
};

const deleteEvidence = async (id: string, token: string) => {
    try {
        // Changed to send empty object as data, as the API might expect a request body
        const response = await axios.patch(
            `${BASE_URL}/api/v1/evidence/delete-evidence/${id}`,
            {}, // Empty object instead of relying on the second parameter being empty
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Error deleting evidence:", error.response?.data || error.message);
        throw error;
    }
};

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

export default function Evidence() {
    // Sample data with the new fields - will be replaced with API data
    const sampleEvidenceData: Evidence[] = [
        {
            _id: "1",
            title: "Evidence Item 1",
            fileUrl: "https://example.com/file1",
            fileType: "true",
            description: "Sample description for evidence 1",
            hash: "hash123456789",
            status: "verified",
            createdAt: new Date().toISOString()
        },
        {
            _id: "2",
            title: "Evidence Item 2",
            fileUrl: "https://example.com/file2",
            fileType: "false",
            description: "Sample description for evidence 2",
            hash: "abcdef123456",
            status: "pending",
            createdAt: new Date().toISOString()
        }
    ];

    const [evidenceData, setEvidenceData] = useState<Evidence[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editEvidence, setEditEvidence] = useState<Evidence | null>(null);
    const [deleteEvidenceItem, setDeleteEvidenceItem] = useState<Evidence | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [dropdownRow, setDropdownRow] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [filterPosition, setFilterPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [viewEvidence, setViewEvidence] = useState<Evidence | null>(null);

    // Get user token from auth store
    const { user } = useAuthStore();

    // Pagination settings
    const rowsPerPage = 3;

    // Fetch evidence on component mount
    useEffect(() => {
        fetchEvidence();
    }, [user]);

    const fetchEvidence = async () => {
        setLoading(true);
        setError(null);
        
        if (!user || !user.token) {
            console.log("No authentication token found, using sample data");
            // Use sample data for development if no auth
            setEvidenceData(sampleEvidenceData);
            setLoading(false);
            return;
        }

        try {
            const evidence = await getEvidence(user.token);
            console.log("Fetched evidence:", evidence);
            setEvidenceData(evidence.length > 0 ? evidence : sampleEvidenceData);
        } catch (error: any) {
            console.error("Failed to fetch evidence:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to fetch evidence";
            setError(errorMessage);
            // Fallback to sample data for development
            setEvidenceData(sampleEvidenceData);
        } finally {
            setLoading(false);
        }
    };

    // Handle successful submission of new evidence
    const handleEvidenceAdded = () => {
        fetchEvidence(); // Refresh the evidence list
        setShowAddForm(false); // Close the add form after successful submission
    };

    // Handle UI interactions
    const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>, evidenceId: string) => {
        // Prevent event from bubbling up
        event.stopPropagation();
        event.preventDefault();
        
        console.log("Dropdown clicked for evidence:", evidenceId);
        
        // Get position for dropdown
        const rect = event.currentTarget.getBoundingClientRect();
        
        // Calculate position, ensuring dropdown is visible and doesn't go off-screen
        setDropdownPosition({ 
            top: rect.bottom + window.scrollY,
            left: rect.left
        });
        
        // Toggle dropdown
        setDropdownRow(dropdownRow === evidenceId ? null : evidenceId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRow) {
                // Check if click was on a dropdown toggle button
                const target = event.target as HTMLElement;
                if (!target.closest('.dropdown-toggle')) {
                    setDropdownRow(null);
                }
            }
        };
        
        // Add the event listener
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            // Remove the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRow]);

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setFilterPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setShowFilterModal(!showFilterModal);
    };

    // Handle view evidence
    const handleViewEvidence = (evidence: Evidence) => {
        setViewEvidence(evidence);
        setDropdownRow(null); // Close dropdown after action
        // Logic for viewing evidence details
        console.log("Viewing evidence:", evidence);
        // You can implement a modal or redirect to a details page
    };

    // Handle edit evidence
    const handleEditEvidence = (evidence: Evidence) => {
        console.log("Editing evidence:", evidence);
        setEditEvidence({ ...evidence }); // Make a copy to avoid reference issues
        setDropdownRow(null); // Close dropdown after selecting an action
    };

    // Delete evidence handler
    const handleDeleteClick = (evidence: Evidence) => {
        console.log("Delete clicked for evidence:", evidence);
        setDeleteEvidenceItem(evidence);
        setShowDeleteModal(true);
        setDropdownRow(null); // Close dropdown after selecting an action
    };

    // Confirm delete action
    const confirmDelete = async () => {
        if (!deleteEvidenceItem || !user?.token) return;

        try {
            setLoading(true);
            console.log("Deleting evidence:", deleteEvidenceItem._id);
            
            // Fix: Remove the empty object parameter and pass token directly
            await deleteEvidence(deleteEvidenceItem._id, user.token);

            // Remove evidence from state
            setEvidenceData(evidenceData.filter(item => item._id !== deleteEvidenceItem._id));
            setShowDeleteModal(false);
            setDeleteEvidenceItem(null);
        } catch (error: any) {
            console.error("Failed to delete evidence:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to delete evidence";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Handle save for edit form
    const handleSaveEdit = async (data: any) => {
        if (!user?.token || !editEvidence) return;
        
        try {
            setLoading(true);
            console.log("Updating evidence:", editEvidence._id, data);
            await updateEvidence(editEvidence._id, data, user.token);
            setEditEvidence(null);
            fetchEvidence(); // Refresh the evidence list
        } catch (error: any) {
            console.error("Failed to update evidence:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update evidence";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Pagination handlers
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Filter evidence based on search term
    const filteredEvidence = evidenceData.filter(evidence =>
        (evidence.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (evidence.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (evidence.fileType?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (evidence.fileUrl?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (evidence.hash?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredEvidence.length / rowsPerPage);

    // Get paginated data
    const paginatedEvidence = filteredEvidence.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Format date helper
    const formatDate = (dateString: any) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return "Invalid date";
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            {showAddForm ? (
                <AddEvidence
                    onClose={() => setShowAddForm(false)}
                    onSuccess={handleEvidenceAdded}
                />
            ) : editEvidence ? (
                <EvidenceEditForm
                    evidence={editEvidence}
                    onClose={() => setEditEvidence(null)}
                    onSave={handleSaveEdit}
                />
            ) : (
                <>
                    <div className="flex flex-row w-full items-center justify-between mb-4">
                        {/* Page title */}
                        <div className="flex gap-2 items-center">
                            <div className="bg-blue-500 h-8 w-3 rounded" />
                            <h1 className="font-semibold text-xl text-black">Evidence</h1>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 items-center">
                            {/* Search Input */}
                            <div className="relative">
                                <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                                <input
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Filter Button */}
                            <button
                                onClick={handleFilterClick}
                                className="flex items-center gap-2 px-4 h-12 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                <BiFilterAlt size={18} />
                                Filter
                            </button>

                            {/* Add Button */}
                            <Button className="px-4" onClick={() => setShowAddForm(true)}>Add Evidence</Button>

                            {/* Export Button */}
                            <button className="flex items-center gap-2 px-4 h-12 border border-gray-300 rounded-md hover:bg-gray-100">
                                <RiFileDownloadLine size={18} />
                                Export
                                <MdKeyboardArrowDown size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Loading, Error, or Table */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col justify-center items-center h-64">
                            <div className="text-red-500 mb-4">Error: {error}</div>
                            <Button onClick={fetchEvidence}>Try Again</Button>
                        </div>
                    ) : evidenceData.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-64">
                            <div className="text-gray-500 mb-4">No evidence records found.</div>
                            <Button onClick={() => setShowAddForm(true)}>Add Your First Evidence</Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-md">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="p-4 text-left">
                                            <input type="checkbox" />
                                        </th>
                                        <th className="p-4 text-left">File URL</th>
                                        <th className="p-4 text-left">File Type</th>
                                        <th className="p-4 text-left">Description</th>
                                        <th className="p-4 text-left">Hash</th>
                                        <th className="p-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEvidence.map((evidence) => (
                                        <tr key={evidence._id} className="border-t border-t-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-6">
                                                <input type="checkbox" />
                                            </td>

                                            <td className="px-4 py-6 max-w-xs truncate">{evidence.fileUrl}</td>
                                            <td className="px-4 py-6">{evidence.fileType}</td>
                                            <td className="px-4 py-6 max-w-xs truncate">{evidence.description}</td>
                                            <td className="px-4 py-6 max-w-xs truncate">{evidence.hash}</td>

                                            <td className="px-4 py-6 relative">
                                                <button 
                                                    className="dropdown-toggle" // Add this class for outside click detection
                                                    onClick={(e) => handleDropdownClick(e, evidence._id)}
                                                >
                                                    <MdMoreVert size={20} />
                                                </button>
                                                
                                                {dropdownRow === evidence._id && (
                                                    <ActionDropdown
                                                        position={dropdownPosition}
                                                        onClose={() => setDropdownRow(null)}
                                                        onEdit={() => handleEditEvidence(evidence)}
                                                        onDelete={() => handleDeleteClick(evidence)}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Filter Modal */}
                    {showFilterModal && (
                        <FilterModal
                            position={filterPosition}
                            onClose={() => setShowFilterModal(false)}
                        />
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && deleteEvidenceItem && (
                        <DeleteConfirmModal
                            isOpen={showDeleteModal}
                            onClose={() => {
                                setShowDeleteModal(false);
                                setDeleteEvidenceItem(null);
                            }}
                            onConfirm={confirmDelete}
                            title={deleteEvidenceItem.title || "this evidence"}
                        />
                    )}

                    {/* Pagination */}
                    {!loading && !error && evidenceData.length > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages || 1}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentPage === 1}
                                    className={`flex items-center px-3 py-2 border rounded-md ${currentPage === 1
                                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                        : "text-gray-700 border-gray-400 hover:bg-gray-100"
                                        }`}
                                >
                                    <MdChevronLeft /> Previous
                                </button>

                                {[...Array(totalPages || 1)].map((_, idx) => {
                                    const page = idx + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-md text-sm ${currentPage === page
                                                ? "bg-blue-500 text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages || !totalPages}
                                    className={`flex items-center px-3 py-2 border rounded-md ${currentPage === totalPages || !totalPages
                                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                        : "text-gray-700 border-gray-400 hover:bg-gray-100"
                                        }`}
                                >
                                    Next <MdChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}