import { useMemo } from "react";
import { useAccidentsStore } from "../../stores/useAccidentsStore";
import { useSettingsStore } from "../../stores/useSettingsStore";
import AccidentGridItem from "./AccidentGridItem";
import { useShallow } from "zustand/react/shallow";

export default function AccidentGrid() {
  const [
    accidents,
    nameFilter,
    getProcessedAccidents
  ] = useAccidentsStore(
    useShallow((state) => [
      state.accidents,
      state.nameFilter,
      state.getProcessedAccidents
    ])
  );

  const settings = useSettingsStore((state) => state.settings);

  const processedAccidents = useMemo(() => {
    return getProcessedAccidents(
      {
        sort: settings.sortBy as ("name" | "date"),
        order: settings.order as ("asc" | "desc"),
      },
      {
        collisionStatus: settings.collisionStatus,
      }
  );
  }, [accidents, nameFilter, settings]);

  return (
    <div className="grid grid-cols-search-results gap-4">
      {processedAccidents.map((accident) => (
        <AccidentGridItem 
          key={`accident-item-${accident.id}`} 
          accident={accident} 
        />
      ))}
      {/* {Array(20).fill(0).map((_, index) => (
        <AccidentGridItem key={`accident-item-${index}`} />
      ))} */}
    </div>
  )  
}