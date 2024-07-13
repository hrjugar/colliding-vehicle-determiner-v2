import { RiBubbleChartLine } from "@remixicon/react"

export default function AddButton() {
  return (
    <button 
      className="non-draggable h-full flex flex-row justify-start items-center gap-2.5 pl-4 pr-6 rounded-xl text-xs font-medium whitespace-nowrap transition-colors bg-indigo-400 text-cool-gray-50 hover:bg-indigo-500 hover:text-cool-gray-100 text-sm"
      onClick={() => {}} // TODO: Implement this
    >
      <RiBubbleChartLine size={16} />
      <span>Analyze Accident</span>
    </button>
  )
}