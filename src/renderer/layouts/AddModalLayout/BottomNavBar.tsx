import { RiArrowDropLeftLine, RiArrowDropRightLine } from "@remixicon/react";
import { useAddModalStore } from "../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";

export default function BottomNavBar() {
  const [
    step,
    goToPreviousStep,
    goToNextStep,
  ] = useAddModalStore(
    useShallow((state) => [
      state.step,
      state.goToPreviousStep,
      state.goToNextStep,
    ])
  ); 

  return (
    <nav className="w-full h-top-nav flex flex-row justify-between items-center px-6 py-4 border-t border-cool-gray-300">
      <button 
        className="flex flex-row justify-start items-center gap-2 text-cool-gray-500 hover:text-cool-gray-600 disabled:text-cool-gray-200"
        onClick={goToPreviousStep}
        disabled={step === 1}
      >
        <RiArrowDropLeftLine size={18} />
        <span className="text-sm">Back</span>
      </button>

      <button 
        className="flex flex-row justify-end items-center gap-2 text-cool-gray-500 hover:text-cool-gray-600 disabled:text-cool-gray-200"
        onClick={goToNextStep}
        disabled={step === 3}
      >
        <span className="text-sm">Next</span>
        <RiArrowDropRightLine size={18} />
      </button>
    </nav>
  );
}