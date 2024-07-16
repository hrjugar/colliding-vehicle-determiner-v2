import { useMemo } from "react";
import { useAccidentsStore } from "../../stores/useAccidentsStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import AccidentGridItem from "./AccidentGridItem";
import { useShallow } from "zustand/react/shallow";
import { Accident } from "../../../main/types";

interface AccidentGridProps {
  processedAccidents: Accident[];
}

export default function AccidentGrid({ processedAccidents } : AccidentGridProps) {
  return (
    <div className="grid grid-cols-search-results gap-4">
      {processedAccidents.map((accident) => (
        <AccidentGridItem 
          key={`accident-item-${accident.id}`} 
          accident={accident} 
        />
      ))}
    </div>
  )  
}