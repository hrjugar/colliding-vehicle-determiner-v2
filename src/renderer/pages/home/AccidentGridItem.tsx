import { RiDeleteBinLine } from "@remixicon/react";
import { Accident } from "../../../main/types"
import { useAccidentsStore } from "../../stores/useAccidentsStore";

interface AccidentGridItemProps {
  accident: Accident;
}

export default function AccidentGridItem({ accident } : AccidentGridItemProps) {
  const deleteAccident = useAccidentsStore((state) => state.deleteAccident);

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2">
      <div className="relative w-full h-full aspect-video bg-cool-gray-100 border border-cool-gray-200">
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
        <p className="text-sm text-cool-gray-400">{accident.dateCreated}</p>
      </div>
    </div>
  )
}