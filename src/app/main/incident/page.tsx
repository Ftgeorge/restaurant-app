"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { FiSearch } from "react-icons/fi";
import { RiFileDownloadLine } from "react-icons/ri";
import { MdKeyboardArrowDown, MdMoreVert, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
import ActionDropdown from "@/components/ActionDropdown";
import FilterModal from "@/components/FilterModal";
import AddIncident from "@/components/AddIncident";

const data = [
    {
        id: 1,
        name: "Mama's Kitchen",
        representative: "Ada Obi",
        location: "Lagos, Nigeria",
        phone: "+2348012345678",
        ratings: 4.5,
        status: "open",
    },
    {
        id: 2,
        name: "Chop Life",
        representative: "John Doe",
        location: "Abuja, Nigeria",
        phone: "+2348098765432",
        ratings: 4.2,
        status: "closed",
    },
    {
        id: 3,
        name: "Jollof Central",
        representative: "Ngozi Chukwu",
        location: "Enugu, Nigeria",
        phone: "+2348034567890",
        ratings: 4.8,
        status: "open",
    },
    {
        id: 4,
        name: "Suya Palace",
        representative: "Ibrahim Musa",
        location: "Kano, Nigeria",
        phone: "+2348023456789",
        ratings: 4.3,
        status: "open",
    },
    {
        id: 5,
        name: "Pounded Yam Spot",
        representative: "Emeka Umeh",
        location: "Port Harcourt, Nigeria",
        phone: "+2348067890123",
        ratings: 4.1,
        status: "closed",
    },
    {
        id: 6,
        name: "Ewa Agoyin Place",
        representative: "Bisi Alabi",
        location: "Ibadan, Nigeria",
        phone: "+2348076543210",
        ratings: 4.4,
        status: "open",
    },
];

export default function Incident() {
    const [dropdownRow, setDropdownRow] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterPosition, setFilterPosition] = useState({ top: 0, left: 0 });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;
    const totalPages = Math.ceil(data.length / rowsPerPage);

    const [showAddForm, setShowAddForm] = useState(false);


    const handleDropdownClick = (event: React.MouseEvent, rowId: number) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setDropdownRow(dropdownRow === rowId ? null : rowId);
    };

    const handleFilterClick = (event: React.MouseEvent) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        setFilterPosition({ top: rect.bottom + window.scrollY, left: rect.left });
        setShowFilterModal(!showFilterModal);
    };

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    return (
        <div className="w-full h-full flex flex-col p-4">
            {showAddForm ? (
                <AddIncident onClose={() => setShowAddForm(false)} />
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

                    {/* Table */}
                    <div className="overflow-x-auto bg-white border rounded-md">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-left">
                                        <input type="checkbox" />
                                    </th>
                                    <th className="p-4 text-left flex items-center gap-1">
                                        Name
                                        <MdKeyboardArrowDown size={16} />
                                    </th>
                                    <th className="p-4 text-left">Representative</th>
                                    <th className="p-4 text-left">Location</th>
                                    <th className="p-4 text-left">Phone Number</th>
                                    <th className="p-4 text-left">Ratings</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((row) => (
                                    <tr key={row.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <input type="checkbox" />
                                        </td>
                                        <td className="p-4">{row.name}</td>
                                        <td className="p-4">{row.representative}</td>
                                        <td className="p-4">{row.location}</td>
                                        <td className="p-4">{row.phone}</td>
                                        <td className="p-4 flex items-center gap-1">
                                            <span>{row.ratings}</span>
                                            <span className="text-yellow-500">★</span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`${row.status === "open" ? "text-green-600" : "text-red-600"
                                                    } capitalize`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="p-4 relative">
                                            <button onClick={(e) => handleDropdownClick(e, row.id)}>
                                                <MdMoreVert size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Filter Modal */}
                    {showFilterModal && (
                        <FilterModal
                            position={filterPosition}
                            onClose={() => setShowFilterModal(false)}
                        />
                    )}

                    {/* Dropdown rendered via portal */}
                    {dropdownRow !== null && (
                        <ActionDropdown
                            position={dropdownPosition}
                            onClose={() => setDropdownRow(null)}
                        />
                    )}

                    {/* Pagination */}
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
                </>
            )}

        </div>

    );
}
