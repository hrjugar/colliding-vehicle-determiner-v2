import AccidentGridItem from "./AccidentGridItem";
import { Accident } from "../../../types";

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