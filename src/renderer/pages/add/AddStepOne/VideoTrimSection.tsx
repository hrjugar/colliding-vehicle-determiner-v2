import { useMemo, useRef } from "react";
import { AddModalSection } from "../../../components/ui/add-modal";
import { useAddModalStore } from "../../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";

export default function VideoTrimSection() {
  const [
    fileName,
    initTime
  ] = useAddModalStore(
    useShallow((state) => [
      state.fileName,
      state.initTime
    ])
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOnLoadedMetadata = () => {
    if (videoRef.current) {
      initTime(videoRef.current.duration);
    }
  };

  return (
    <AddModalSection className="flex-grow p-4">
      <div className="flex-grow bg-gray-200 flex justify-center items-center overflow-hidden">
        <video
          ref={videoRef}
          controls
          onLoadedMetadata={handleOnLoadedMetadata}
          className="w-full h-full object-contain" 
        >
          <source src={`video://${fileName}`} type="video/mp4" />
        </video>
      </div>

      <div className="w-full min-h-20 bg-red-200" />
    </AddModalSection>
  )
}