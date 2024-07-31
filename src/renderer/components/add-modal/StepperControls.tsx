import { RiArrowDropLeftLine, RiArrowDropRightLine } from "@remixicon/react";
import { useAddModalStore } from "../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";

interface StepperControlsProps {
  isNextButtonDisabled?: boolean;
}

export default function StepperControls({ isNextButtonDisabled } : StepperControlsProps) {
  const [
    step,
    goToPreviousStep,
  ] = useAddModalStore(
    useShallow((state) => [
      state.step,
      state.goToPreviousStep,
    ])
  ); 

  return (
    <nav className="sticky bottom-0 w-full min-h-top-nav flex flex-row justify-between items-center px-6 py-4 bg-white border-t border-cool-gray-300">
      <button 
        type="button"
        className="flex flex-row justify-start items-center gap-2 text-cool-gray-500 hover:text-cool-gray-600 disabled:text-cool-gray-200"
        onClick={goToPreviousStep}
        disabled={step === 1}
      >
        <RiArrowDropLeftLine size={18} />
        <span className="text-sm">Back</span>
      </button>

      <button 
        type="submit"
        className="flex flex-row justify-end items-center gap-2 text-cool-gray-500 hover:text-cool-gray-600 disabled:text-cool-gray-200"
        disabled={step === 3 || isNextButtonDisabled}
      >
        <span className="text-sm">Next</span>
        <RiArrowDropRightLine size={18} />
      </button>
    </nav>
  );
}