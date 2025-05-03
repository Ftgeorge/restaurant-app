import { MdEdit, MdToggleOff, MdVisibility } from "react-icons/md";
import ReactDOM from "react-dom";
import { IoMdTrash } from "react-icons/io";

interface ActionDropdownProps {
    position: { top: number; left: number };
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ActionDropdown({ position, onClose, onEdit, onDelete }: ActionDropdownProps) {
    return ReactDOM.createPortal(
        <div className="absolute w-40 bg-white border border-gray-200 shadow-md rounded-md z-50 p-1"
            style={{ top: position.top, left: position.left }}>
            <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onClose}>
                <MdVisibility className="text-gray-500" size={18} /> View
            </button>
            <button
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                    onEdit();
                    onClose();
                }}>
                <MdEdit className="text-gray-500" size={18} /> Edit
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                    onDelete();
                    onClose();
                }}>
                <IoMdTrash className="text-gray-500" size={18} /> Delete
            </button>
        </div>,
        document.body
    );
}