import AccidentGridItem from "./AccidentGridItem";
import { Accident } from "../../../types";

interface AccidentGridProps {
  processedAccidents: Accident[];
}

export default function AccidentGrid({ processedAccidents } : AccidentGridProps) {
  return (
    <div className="grid grid-cols-search-results gap-2">
      {processedAccidents.map((accident, index) => (
        <AccidentGridItem 
          key={`accident-item-${accident.id}`} 
          accident={accident}
          index={index}
        />
      ))}
    </div>
  )  
}