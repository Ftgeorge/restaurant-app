import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import ReactDOM from "react-dom";

interface ActionDropdownProps {
    position: { top: number; left: number };
    onClose: () => void;
}

export default function ActionDropdown({ position, onClose }: ActionDropdownProps) {
    return ReactDOM.createPortal(
        <div
            className="absolute w-40 bg-white border border-gray-200 shadow-md rounded-md z-50"
            style={{ top: position.top, left: position.left }}
        >
            <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onClose}>
                <MdVisibility size={18} /> View
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onClose}>
                <MdEdit size={18} /> Edit
            </button>
            <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600" onClick={onClose}>
                <MdDelete size={18} /> Disactivate
            </button>
        </div>,
        document.body
    );
}
