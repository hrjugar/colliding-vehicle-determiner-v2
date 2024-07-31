import { AddModalSection } from "../../../components/ui/add-modal";
import { useAddModalStore } from "../../../stores/useAddModalStore";

export default function VideoTrimSection() {
  const fileName = useAddModalStore((state) => state.fileName);

  return (
    <AddModalSection className="flex-grow p-4">
      <div className="flex-grow bg-gray-200 flex justify-center items-center overflow-hidden">
        <video className="w-full h-full object-contain" controls>
          <source src={`video://${fileName}`} type="video/mp4" />
        </video>
      </div>

      <div className="w-full min-h-20 bg-red-200" />
    </AddModalSection>
  )
}