"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/button";
import { MdArrowBack } from "react-icons/md";
import { updateReport } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
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
interface Report {
    _id: string;
    _orderedBy: OrderedBy;
    products: Product[];
    status: string;
    note: string;
    createdAt: string;
}
interface EditReportFormProps {
    report: Report;
    onClose: () => void;
}
export default function ReportEditForm({ report, onClose }: EditReportFormProps) {
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        note: report.note,
        status: report.status,
        products: report.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            unitPrice: product.unitPrice
        }))
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleProductChange = (index: number, field: string, value: string | number) => {
        const updatedProducts = [...formData.products];
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: field === "quantity" || field === "unitPrice" ? Number(value) : value
        };

        setFormData({
            ...formData,
            products: updatedProducts
        });
    };
    const addProductField = () => {
        setFormData({
            ...formData,
            products: [...formData.products, { productId: "", quantity: 1, unitPrice: 0 }]
        });
    };
    const removeProductField = (index: number) => {
        if (formData.products.length > 1) {
            const updatedProducts = [...formData.products];
            updatedProducts.splice(index, 1);
            setFormData({
                ...formData,
                products: updatedProducts
            });
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.token) {
            setError("You must be logged in to update this report");
            return;
        }
        try {
            setLoading(true);
            setError(null);

            await updateReport(report._id, formData, user.token);

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update report";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full">
            <div className="flex items-center mb-6">
                <button onClick={onClose} className="mr-4">
                    <MdArrowBack size={24} />
                </button>
                <h2 className="text-xl font-semibold">Edit Report</h2>
            </div>
            {success ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Report updated successfully!
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 shadow-sm">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="canceled">Canceled</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
                            Note
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            placeholder="Add any notes about this report"
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-700 text-md font-bold">Products</h3>
                            <button
                                type="button"
                                onClick={addProductField}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                            >
                                Add Product
                            </button>
                        </div>

                        {formData.products.map((product, index) => (
                            <div key={index} className="border p-4 rounded mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-gray-700">Product #{index + 1}</h4>
                                    {formData.products.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProductField(index)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Product ID
                                        </label>
                                        <input
                                            type="text"
                                            value={product.productId}
                                            onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={product.quantity}
                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Unit Price
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={product.unitPrice}
                                            onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Button
                            type="button"

                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"

                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Report"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}