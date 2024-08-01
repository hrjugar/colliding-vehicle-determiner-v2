import { RiBubbleChartLine } from "@remixicon/react"
import { useAccidentsStore } from "../../../stores/useAccidentsStore"
import { useMutation } from "react-query";

export default function AddButton() {
  const findAccident = useAccidentsStore(state => state.findAccident);
  const findAccidentMutation = useMutation(findAccident, {
    onSuccess: async (filePath) => {
      if (filePath) {
        await window.electron.addModal.open(filePath);
      }
    },
  });
  
  return (
    <button 
      className="non-draggable h-full flex flex-row justify-start items-center gap-2.5 px-4 rounded-xl text-sm font-medium whitespace-nowrap transition-colors bg-indigo-400 text-cool-gray-50 hover:bg-indigo-500 hover:text-cool-gray-100"
      onClick={() => findAccidentMutation.mutate()}
    >
      <RiBubbleChartLine size={18} />
      <span>Analyze Accident</span>
    </button>
  )
}