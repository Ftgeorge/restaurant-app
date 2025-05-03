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
import { getAudits } from "@/lib/api";
import AddAudit from "@/components/AddAudit";

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    unit: string;
    createdAt: string;
}

interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    userType: string;
}

interface Audit {
    _id: string;
    _user: User;
    _product: Product;
    quantity: string;
    location: string;
    createdAt: string;
    lastUpdated: string;
}

export default function Audit() {
    const [audits, setAudits] = useState<Audit[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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

    // Fetch audits on component mount
    useEffect(() => {
        fetchAudits();
    }, [user]);

    const fetchAudits = async () => {
        if (!user || !user.token) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            const auditData = await getAudits(user.token);
            setAudits(auditData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch audits:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch audits";
            setError(errorMessage);
            setLoading(false);
        }
    };

    // Handle UI interactions
    const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>, auditId: string) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setDropdownRow(dropdownRow === auditId ? null : auditId);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setFilterPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setShowFilterModal(!showFilterModal);
    };

    // Pagination handlers
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Filter audits based on search term
    const filteredAudits = audits.filter(audit =>
        audit._product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit._product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${audit._user.firstname} ${audit._user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate total pages
    const totalPages = Math.ceil(filteredAudits.length / rowsPerPage);

    // Get paginated data
    const paginatedAudits = filteredAudits.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format price helper
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(price);
    };

    return (
        <div className="w-full h-full flex flex-col p-4">
            {showAddForm ? (
                <AddAudit onClose={() => setShowAddForm(false)} />
            ) : (
                <>
                    <div className="flex flex-row w-full items-center justify-between mb-4">
                        {/* Page title */}
                        <div className="flex gap-2 items-center">
                            <div className="bg-blue-500 h-8 w-3 rounded" />
                            <h1 className="font-semibold text-xl text-black">Audit</h1>
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
                            <Button className="px-4" onClick={() => setShowAddForm(true)}>Add Audit</Button>

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
                    ) : audits.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No audit records found.
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
                                            Product Name
                                            <MdKeyboardArrowDown size={16} />
                                        </th>
                                        <th className="p-4 text-left">Supplier</th>
                                        <th className="p-4 text-left">Quantity</th>
                                        <th className="p-4 text-left">Price</th>
                                        <th className="p-4 text-left">Location</th>
                                        <th className="p-4 text-left">Created At</th>
                                        <th className="p-4 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAudits.map((audit) => (
                                        <tr key={audit._id} className="border-t border-t-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-6">
                                                <input type="checkbox" />
                                            </td>
                                            <td className="px-4 py-6 font-medium">{audit._product.name}</td>
                                            <td className="px-4 py-6">{`${audit._user.firstname} ${audit._user.lastname}`}</td>
                                            <td className="px-4 py-6">{audit.quantity} {audit._product.unit}s</td>
                                            <td className="px-4 py-6">{formatPrice(audit._product.price)}</td>
                                            <td className="px-4 py-6">{audit.location}</td>
                                            <td className="px-4 py-6">{formatDate(audit.createdAt)}</td>
                                            <td className="px-4 py-6 relative">
                                                <button onClick={(e) => handleDropdownClick(e, audit._id)}>
                                                    <MdMoreVert size={20} />
                                                </button>
                                                {dropdownRow === audit._id && (
                                                    <ActionDropdown
                                                        position={dropdownPosition}
                                                        onClose={() => setDropdownRow(null)}
                                                        onEdit={() => }
                                                        onDelete={() => }
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

                    {/* Pagination */}
                    {!loading && !error && audits.length > 0 && (
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