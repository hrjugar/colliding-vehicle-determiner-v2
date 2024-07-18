import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Accident } from "../../../types";
import { convertToRelativeDate } from "../../utils/date";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useAccidentsStore } from "../../stores/useAccidentsStore";
import { useOsStore } from "../../stores/useOsStore";
import { useAccidentItemsStore } from "./useAccidentItemsStore";

interface AccidentTableProps {
  processedAccidents: Accident[];
}

export default function AccidentTable({ processedAccidents } : AccidentTableProps) {
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
    <table className="text-sm whitespace-nowrap table-auto mt-4">
      <thead className="text-cool-gray-500">
        <tr className="text-left">
          <td className="w-1/2 pb-4">Name</td>
          <td className="pb-4">Has Collision</td>
          <td className="pb-4">Created</td>
        </tr>
      </thead>

      <tbody className="text-cool-gray-600 select-none">
        {processedAccidents.map((accident, index) => {
          const isSelected = selectedItemIndexes.has(index);

          return (
            <tr 
              key={`accident-table-row-${accident.id}`}
              className="group cursor-pointer hover:brightness-95"
              onClick={(e) => handleItemClick(e, accident, index)}
            >
              <td 
                className={`
                  flex flex-row justify-start items-center gap-4 p-2 rounded-l-sm
                  ${isSelected ? 'bg-indigo-100' : 'group-hover:bg-cool-gray-100'}
                `}
              >
                <div className="w-24 flex justify-center items-center overflow-hidden">
                  <img
                    src={`mediahandler://thumbnail//${accident.id}`}
                    className="max-w-full max-h-full object-contain rounded-sm"
                  />
                </div>

                <p className="font-semibold">{accident.name}</p>
              </td>

              <td 
                className={`${isSelected ? 'bg-indigo-100' : 'group-hover:bg-cool-gray-100'}`}
              >
                {accident.collidingVehicle === 0 ? 'No' : 'Yes'}
              </td>

              <td 
                className={`rounded-r-sm ${isSelected ? 'bg-indigo-100' : 'group-hover:bg-cool-gray-100'}`}
              >
                {convertToRelativeDate(accident.dateCreated)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )
}