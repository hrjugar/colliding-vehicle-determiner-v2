import { RiBubbleChartLine } from "@remixicon/react"
import { useAccidentsStore } from "../../stores/useAccidentsStore"

export default function AddButton() {
  const addAccident = useAccidentsStore((state) => state.addAccident);

  return (
    <button 
      className="non-draggable h-full flex flex-row justify-start items-center gap-2.5 px-4 rounded-xl text-sm font-medium whitespace-nowrap transition-colors bg-indigo-400 text-cool-gray-50 hover:bg-indigo-500 hover:text-cool-gray-100"
      // TEMPORARY ONLY
      onClick={async () => await addAccident({
        name: 'New Accident',
        collidingVehicle: 0
      })}
    >
      <RiBubbleChartLine size={18} />
      <span>Analyze Accident</span>
    </button>
  )
}