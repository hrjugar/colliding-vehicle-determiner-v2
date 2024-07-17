import { RiDeleteBinLine } from "@remixicon/react";
import { Accident } from "../../../types";
import { useAccidentsStore } from "../../stores/useAccidentsStore";
import { convertToRelativeDate } from "../../utils/date";
import { NavLink, useNavigate } from "react-router-dom";
import { useAccidentItemsStore } from "./useAccidentItemsStore";
import { useShallow } from "zustand/react/shallow";
import { useOsStore } from "../../stores/useOsStore";

interface AccidentGridItemProps {
  accident: Accident;
  index: number;
}

export default function AccidentGridItem({ accident, index } : AccidentGridItemProps) {
  const deleteAccident = useAccidentsStore((state) => state.deleteAccident);
  const [
    selectedItemIndexes,
    selectItems,
  ] = useAccidentItemsStore(
    useShallow((state) => [
      state.selectedItemIndexes,
      state.selectItems,
    ])
  );

  const os = useOsStore((state) => state.os);
  const navigate = useNavigate();

  const handleClick: React.MouseEventHandler = (e) => {
    e.stopPropagation();

    if (e.detail === 2) {
      navigate(`/accident/${accident.id}`);
    } else {
      const singleSelectorKey = os === "darwin" ? "metaKey" : "ctrlKey";
      
      if (e[singleSelectorKey] || e.shiftKey) {
        selectItems(index, e.shiftKey);
      } 
    }
  };

  return (
    <div
      className={`
        group w-full h-full flex flex-col justify-start items-start gap-2 p-2 rounded-md cursor-pointer select-none
        ${selectedItemIndexes.has(index) ? 'bg-indigo-100' : 'hover:bg-cool-gray-100'}
      `}
      onClick={handleClick}
    >
      <div className="relative w-full h-full aspect-video bg-cool-gray-100 border border-cool-gray-200 rounded-sm group-hover:bg-cool-gray-200">
        {/* TEMPORARY ONLY */}
        <button 
          className="absolute top-2 right-2 p-2 flex justify-center items-center rounded-md bg-white border border-cool-gray-100"
          onClick={() => deleteAccident(accident.id)}
        >
          <RiDeleteBinLine size={18} />
        </button>
      </div>

      <div className="w-full flex flex-col justify-start items-start">
        <p className="text-base leading-none text-cool-gray-500">{accident.name}</p>
        <p className="text-sm text-cool-gray-400">Created {convertToRelativeDate(accident.dateCreated)}</p>
      </div>
    </div>
  )
}