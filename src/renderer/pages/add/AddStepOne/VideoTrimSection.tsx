import { useMemo, useRef } from "react";
import { AddModalSection } from "../../../components/ui/add-modal";
import { useAddModalStore } from "../../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";
import VideoPlayer from "../../../components/VideoPlayer";

export default function VideoTrimSection() {
  const [
    fileName,
    videoRef,
    initTime
  ] = useAddModalStore(
    useShallow((state) => [
      state.fileName,
      state.videoRef,
      state.initTime
    ])
  );

  const handleOnLoadedMetadata = () => {
    if (videoRef.current) {
      initTime(videoRef.current.duration);
    }
  };

  return (
    <AddModalSection className="flex-grow p-4">
      <VideoPlayer
        ref={videoRef}
        fileName={fileName}
        videoProps={{
          onLoadedMetadata: handleOnLoadedMetadata
        }}
      />

      <div className="w-full min-h-20 bg-red-200" />
    </AddModalSection>
  )
}