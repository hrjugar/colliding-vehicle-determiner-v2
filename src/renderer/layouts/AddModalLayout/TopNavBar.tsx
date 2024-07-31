import { RiCloseLine } from "@remixicon/react";
import { useAddModalStore } from "../../stores/useAddModalStore";

const titles = [
  "Setup Accident Video",
  "Identify Area of Accident",
  "Identify Vehicles",
];

export default function TopNavBar() {
  const step = useAddModalStore((state) => state.step);
  const fileName = useAddModalStore((state) => state.fileName);

  return (
    <nav 
      className="draggable sticky top-0 w-full min-h-top-nav flex flex-row justify-between items-center px-6 py-4 bg-white border-b border-cool-gray-300"
    >
      {fileName && (
        <>
          <span className="flex-1 text-sm text-cool-gray-500">Step {step}/3</span>
          <p className="font-medium text-cool-gray-700">{titles[step - 1]}</p>
        </>
      )}

      <div className="flex-1 flex flex-row justify-end items-center">
        <button 
          className="non-draggable text-cool-gray-500 hover:text-cool-gray-600"
          onClick={async () => await window.electron.addModal.close()}
        >
          <RiCloseLine size={18} />
        </button>
      </div>
    </nav>
  );
}