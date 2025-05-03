"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { FiSearch } from "react-icons/fi";
import { RiFileDownloadLine } from "react-icons/ri";
import { MdKeyboardArrowDown, MdMoreVert, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
import ActionDropdown from "@/components/ActionDropdown";
import FilterModal from "@/components/FilterModal";
import AddIncident from "@/components/AddIncident";
import { useAuthStore } from "@/store/authStore";
import IncidentEditForm from "@/components/EditIncident";
import DeleteConfirmModal from "@/components/modal/DeleteModal";
import { getIncidents, deleteIncident as deleteIncidentAPI } from "@/lib/api";

interface Incident {
    _id: string;
    title: string;
    targetModel: string;
    targetId: string;
    description: string;
    tag: string[];
    status: string;
    createdAt: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export default function Incident() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editIncident, setEditIncident] = useState<Incident | null>(null);
    const [deleteIncident, setDeleteIncident] = useState<Incident | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [dropdownRow, setDropdownRow] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [filterPosition, setFilterPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Get user token from auth store
    const { user } = useAuthStore();

    // Pagination settings
    const rowsPerPage = 3;

    // Fetch incidents on component mount
    useEffect(() => {
        fetchIncidents();
    }, [user]);

    const fetchIncidents = async () => {
        if (!user || !user.token) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            const incidentsData = await getIncidents(user.token);
            setIncidents(incidentsData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch incidents:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch incidents";
            setError(errorMessage);
            setLoading(false);
        }
    };

    // Handle UI interactions
    const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>, incidentId: string) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setDropdownRow(dropdownRow === incidentId ? null : incidentId);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setFilterPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setShowFilterModal(!showFilterModal);
    };

    // Delete incident handler
    const handleDeleteClick = (incident: Incident) => {
        setDeleteIncident(incident);
        setShowDeleteModal(true);
        setDropdownRow(null); // Close dropdown
    };

    // Confirm delete action
    // Confirm delete action
    const confirmDelete = async () => {
        if (!deleteIncident || !user?.token) return;

        try {
            setLoading(true);
            // Use the renamed deleteIncidentAPI function
            await deleteIncidentAPI(deleteIncident._id, {}, user.token);

            // Remove incident from state
            setIncidents(incidents.filter(inc => inc._id !== deleteIncident._id));
            setShowDeleteModal(false);
            setDeleteIncident(null);
        } catch (error) {
            console.error("Failed to delete incident:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to delete incident";
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

    // Filter incidents based on search term
    const filteredIncidents = incidents.filter(incident =>
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.tag.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredIncidents.length / rowsPerPage);

    // Get paginated data
    const paginatedIncidents = filteredIncidents.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Format date helper
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            {showAddForm ? (
                <AddIncident onClose={() => setShowAddForm(false)} />
            ) : editIncident ? (
                <IncidentEditForm incident={editIncident} onClose={() => setEditIncident(null)} />
            ) : (
                <>
                    <div className="flex flex-row w-full items-center justify-between mb-4">
                        {/* Page title */}
                        <div className="flex gap-2 items-center">
                            <div className="bg-blue-500 h-8 w-3 rounded" />
                            <h1 className="font-semibold text-xl text-black">Incidents</h1>
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
                            <Button className="px-4" onClick={() => setShowAddForm(true)}>Add Incident</Button>

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
                        <div className="flex justify-center items-center h-64 text-red-500">
                            Error: {error}. Please try again.
                        </div>
                    ) : incidents.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No incidents found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-md">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left">
                                            <input type="checkbox" />
                                        </th>
                                        <th className="p-4 text-left flex items-center gap-1">
                                            Title
                                            <MdKeyboardArrowDown size={16} />
                                        </th>
                                        <th className="p-4 text-left">Target</th>
                                        <th className="p-4 text-left">Description</th>
                                        <th className="p-4 text-left">Tags</th>
                                        <th className="p-4 text-left">Created</th>
                                        <th className="p-4 text-left">Status</th>
                                        <th className="p-4 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedIncidents.map((incident) => (
                                        <tr key={incident._id} className="border-t border-t-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-6">
                                                <input type="checkbox" />
                                            </td>
                                            <td className="px-4 py-6 font-medium">{incident.title}</td>
                                            <td className="px-4 py-6">{incident.targetModel}</td>
                                            <td className="px-4 py-6 max-w-xs truncate">{incident.description}</td>
                                            <td className="px-4 py-6">
                                                <div className="flex flex-wrap gap-1">
                                                    {incident.tag.map((tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">{formatDate(incident.createdAt)}</td>
                                            <td className="px-4 py-6">
                                                <span
                                                    className={`${incident.status === "resolved"
                                                        ? "text-green-600 bg-green-100"
                                                        : incident.status === "pending"
                                                            ? "text-yellow-600 bg-yellow-100"
                                                            : "text-red-600 bg-red-100"
                                                        } capitalize px-2 py-1 rounded-full text-xs`}
                                                >
                                                    {incident.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-6 relative">
                                                <button onClick={(e) => handleDropdownClick(e, incident._id)}>
                                                    <MdMoreVert size={20} />
                                                </button>
                                                {dropdownRow === incident._id && (
                                                    <ActionDropdown
                                                        position={dropdownPosition}
                                                        onClose={() => setDropdownRow(null)}
                                                        onEdit={() => setEditIncident(incident)}
                                                        onDelete={() => handleDeleteClick(incident)}
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
                    {showDeleteModal && deleteIncident && (
                        <DeleteConfirmModal
                            isOpen={showDeleteModal}
                            onClose={() => {
                                setShowDeleteModal(false);
                                setDeleteIncident(null);
                            }}
                            onConfirm={confirmDelete}
                            title={deleteIncident.title}
                        />
                    )}

                    {/* Pagination */}
                    {!loading && !error && incidents.length > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
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

                                {[...Array(totalPages)].map((_, idx) => {
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
                                    disabled={currentPage === totalPages}
                                    className={`flex items-center px-3 py-2 border rounded-md ${currentPage === totalPages
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