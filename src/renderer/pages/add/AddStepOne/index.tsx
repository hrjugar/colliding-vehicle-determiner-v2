import StepperControls from "../../../components/add-modal/StepperControls"
import { useAddModalStore } from "../../../stores/useAddModalStore";
import VideoPropertiesSection from "./VideoPropertiesSection"
import VideoTrimSection from "./VideoTrimSection"

export default function AddStepOne() {
  const accidentName = useAddModalStore((state) => state.accidentName);
  const goToNextStep = useAddModalStore((state) => state.goToNextStep);

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form className="relative flex-grow flex flex-col justify-start items-stretch" onSubmit={handleSubmit}>
      <main className="flex-grow flex flex-row justify-start items-stretch p-0 overflow-hidden">
        <VideoPropertiesSection />
        <VideoTrimSection />
      </main>

      <StepperControls isNextButtonDisabled={!accidentName} />
    </form>
  )
}