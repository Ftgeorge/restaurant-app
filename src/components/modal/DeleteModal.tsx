import { ReactNode } from "react";
import ReactDOM from "react-dom";
import { Button } from "@/components/button";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
                    <p className="text-gray-600">
                        Are you sure you want to delete <span className="font-medium">{title}</span>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            onClick={onClose}
                            className="px-4 py-2 border"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}