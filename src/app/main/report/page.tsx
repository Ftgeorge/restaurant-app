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
import { getReports, deleteReport as deleteReportAPI } from "@/lib/api";
import AddReport from "@/components/AddReport";
import ReportEditForm from "@/components/EdiReport";

// Define the interfaces to match exactly what EditReport expects
interface OrderedBy {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    userType: string;
}

interface Product {
    productId: string;
    quantity: number;
    unitPrice: number;
    _id: string;
}

// This interface must match exactly what the ReportEditForm component expects
interface Incident {
    _id: string;
    title: string;
    description: string;
    location: {
        latitude: number;
        longitude: number;
    };
    targetModel: string;
    targetId: string;
    tag: string[];
    status: string;
    createdAt: string;
    __v: number;
}

interface Report {
    _id: string;
    _orderedBy: OrderedBy;
    products: Product[];
    status: string;
    note: string;
    createdAt: string;
    _incident?: Incident; // updated from string to Incident
    content?: string;
    signed?: string;
    signature?: string;
}

export default function Report() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editReport, setEditReport] = useState<Report | null>(null);
    const [deleteReport, setDeleteReport] = useState<Report | null>(null);
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

    // Fetch reports on component mount
    useEffect(() => {
        fetchReports();
    }, [user]);

    const fetchReports = async () => {
        try {
            const reportsData = await getReports("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTcxYjA2Y2NlMmJjZjQ4MzNiYmI0NCIsImlhdCI6MTc0NjM0NTIzMywiZXhwIjoxNzQ4OTM3MjMzfQ.z4jeUtLNItuT32FFkoMYwQlCNdvNmH8dbhtgnBWdpso");

            // Transform API response to match required Report interface
                const formattedReports: Report[] = reportsData.map((report: any) => ({
                    _id: report._id,
                    _orderedBy: report._orderedBy || {
                        _id: '',
                        firstname: '',
                        lastname: '',
                        email: '',
                        userType: ''
                    },
                    products: report.products || [],
                    status: report.status || 'pending',
                    note: report.note || report.content || '',
                    createdAt: report.createdAt,
                    _incident: typeof report._incident === 'object' && report._incident !== null
                        ? report._incident.title // Extract just the title
                        : report._incident || '',
                    content: report.content || report.note || '',
                    signed: report.signed || '',
                    signature: report.signature || ''
                }));

            setReports(formattedReports);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch reports";
            setError(errorMessage);
            setLoading(false);
        }
    };

    // Handle UI interactions
    const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>, reportId: string) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setDropdownRow(dropdownRow === reportId ? null : reportId);
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setFilterPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setShowFilterModal(!showFilterModal);
    };

    // Delete report handler
    const handleDeleteClick = (report: Report) => {
        setDeleteReport(report);
        setShowDeleteModal(true);
        setDropdownRow(null); // Close dropdown
    };

    // Confirm delete action
    const confirmDelete = async () => {
        if (!deleteReport || !user?.token) return;

        try {
            setLoading(true);
            // Use the deleteReportAPI function
            await deleteReportAPI(deleteReport._id, {}, user.token);

            // Remove report from state
            setReports(reports.filter(report => report._id !== deleteReport._id));
            setShowDeleteModal(false);
            setDeleteReport(null);
        } catch (error) {
            console.error("Failed to delete report:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to delete report";
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

    // Filter reports based on search term with null checks
    const filteredReports = reports.filter(report => {
        // Using optional chaining and nullish coalescing for safe property access
        const contentMatch = (report.content ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const incidentMatch = report._incident?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;


        const signedMatch = (report.signed ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const signatureMatch = (report.signature ?? '').toLowerCase().includes(searchTerm.toLowerCase());
        const noteMatch = (report.note ?? '').toLowerCase().includes(searchTerm.toLowerCase());

        // Support for searching by orderer name if available
        let nameMatch = false;
        if (report._orderedBy) {
            const firstName = report._orderedBy.firstname ?? '';
            const lastName = report._orderedBy.lastname ?? '';
            nameMatch = `${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return contentMatch || incidentMatch || signedMatch || signatureMatch || noteMatch || nameMatch;
    });

    // Calculate total pages
    const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

    // Get paginated data
    const paginatedReports = filteredReports.slice(
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

    return (
        <div className="w-full h-full flex flex-col p-4">
            {showAddForm ? (
                <AddReport onClose={() => setShowAddForm(false)} />
            ) : editReport ? (
                <ReportEditForm report={editReport} onClose={() => setEditReport(null)} />
            ) : (
                <>
                    <div className="flex flex-row w-full items-center justify-between mb-4">
                        {/* Page title */}
                        <div className="flex gap-2 items-center">
                            <div className="bg-blue-500 h-8 w-3 rounded" />
                            <h1 className="font-semibold text-xl text-black">Reports</h1>
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
                            <Button className="px-4" onClick={() => setShowAddForm(true)}>Add Report</Button>

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
                    ) : reports.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500">
                            No reports found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-md">
                            <table className="min-w-full">
                                <thead>
                                    <tr>
                                        <th className="p-4 text-left">
                                            <input type="checkbox" />
                                        </th>
                                        <th className="p-4 text-left">Incident</th>
                                        <th className="p-4 text-left">Content</th>
                                        <th className="p-4 text-left">Signed</th>
                                        <th className="p-4 text-left">Signature</th>
                                        <th className="p-4 text-left">Created At</th>
                                        <th className="p-4 text-left">Status</th>
                                        <th className="p-4 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedReports.map((report) => (
                                        <tr key={report._id} className="border-t border-t-gray-200 hover:bg-gray-50">
                                            <td className="px-4 py-6">
                                                <input type="checkbox" />
                                            </td>
                                            <td className="px-4 py-6">
                                                {typeof report._incident === "object" ? report._incident.title : report._incident ?? 'N/A'}
                                            </td>
                                            <td className="px-4 py-6">
                                                {report.content ?? 'N/A'}
                                            </td>
                                            <td className="px-4 py-6">
                                                {report.signed ?? 'N/A'}
                                            </td>
                                            <td className="px-4 py-6">
                                                {report.signature ?? 'N/A'}
                                            </td>
                                            <td className="px-4 py-6">
                                                {report.createdAt ? formatDate(report.createdAt) : 'N/A'}
                                            </td>
                                            <td className="px-4 py-6">
                                                {report.status && (
                                                    <span
                                                        className={`${report.status === "completed"
                                                            ? "text-green-600 bg-green-100"
                                                            : report.status === "pending"
                                                                ? "text-yellow-600 bg-yellow-100"
                                                                : "text-red-600 bg-red-100"
                                                            } capitalize px-2 py-1 rounded-full text-xs`}
                                                    >
                                                        {report.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-6 relative">
                                                <button onClick={(e) => handleDropdownClick(e, report._id)}>
                                                    <MdMoreVert size={20} />
                                                </button>
                                                {dropdownRow === report._id && (
                                                    <ActionDropdown
                                                        position={dropdownPosition}
                                                        onClose={() => setDropdownRow(null)}
                                                        onEdit={() => setEditReport(report)}
                                                        onDelete={() => handleDeleteClick(report)}
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
                    {showDeleteModal && deleteReport && (
                        <DeleteConfirmModal
                            isOpen={showDeleteModal}
                            onClose={() => {
                                setShowDeleteModal(false);
                                setDeleteReport(null);
                            }}
                            onConfirm={confirmDelete}
                            title={deleteReport._orderedBy
                                ? `Order by ${deleteReport._orderedBy.firstname || ''} ${deleteReport._orderedBy.lastname || ''}`
                                : `Report for incident ${deleteReport._incident}`
                            }
                        />
                    )}

                    {/* Pagination */}
                    {!loading && !error && reports.length > 0 && (
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