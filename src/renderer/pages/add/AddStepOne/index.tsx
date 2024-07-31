import VideoPropertiesSection from "./VideoPropertiesSection"
import VideoTrimSection from "./VideoTrimSection"

export default function AddStepOne() {
  return (
    <main className="flex flex-row justify-start items-stretch p-0 overflow-hidden">
      <VideoPropertiesSection />
      <VideoTrimSection />
    </main>
  )
}