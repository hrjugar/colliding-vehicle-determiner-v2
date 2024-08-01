import { Accident } from "../../../types";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useAccidentsStore } from "../../stores/useAccidentsStore";
import { useServerConfigStore } from "../../stores/useServerConfigStore";
import { useAccidentItemsStore } from "./useAccidentItemsStore";
import { RiDeleteBinLine } from "@remixicon/react";
import { convertToRelativeDate } from "../../utils/date";

interface AccidentGridProps {
  processedAccidents: Accident[];
}

export default function AccidentGrid({ processedAccidents } : AccidentGridProps) {
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

  const os = useServerConfigStore((state) => state.os);
  const navigate = useNavigate();

  const handleItemClick = (e: React.MouseEvent, accident: Accident, index: number) => {
    e.stopPropagation();

    if (e.detail === 2) {
      navigate(`/accident/${accident.id}`);
    } else {
      const singleSelectorKey = os === "darwin" ? "metaKey" : "ctrlKey";
      selectItems(index, e.shiftKey, !e[singleSelectorKey]);
    }
  };
  
  return (
    <div className="grid grid-cols-search-results gap-2">
      {processedAccidents.map((accident, index) => (
        <div
          key={`accident-grid-item-${accident.id}`}
          className={`
            group w-full h-full flex flex-col justify-start items-start gap-2 p-2 rounded-md cursor-pointer select-none
            ${selectedItemIndexes.has(index) ? 'bg-indigo-100' : 'hover:bg-cool-gray-100'}
          `}
          onClick={(e) => handleItemClick(e, accident, index)}
        >
          <div className="relative w-full h-full aspect-video bg-cool-gray-100 border border-cool-gray-200 rounded-sm group-hover:brightness-95">
            {/* TEMPORARY ONLY */}
            <img 
              src={`mediahandler://thumbnail//${accident.id}`} 
              className="max-w-full max-h-full object-contain object-center"
              alt="Accident thumbnail"
            />
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
      ))}
    </div>
  )  
}