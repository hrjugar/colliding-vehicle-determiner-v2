import { useMemo, useRef } from "react";
import { AddModalSection } from "../../../components/ui/add-modal";
import { useAddModalStore } from "../../../stores/useAddModalStore";
import { useShallow } from "zustand/react/shallow";
import VideoPlayer from "../../../components/VideoPlayer";
import VideoScrubber from "../../../components/VideoScrubber";

export default function VideoTrimSection() {
  const [
    fileName,
    videoRef,
    startTime,
    endTime,
    duration,
    initTime,
    setStartTime,
    setEndTime,
  ] = useAddModalStore(
    useShallow((state) => [
      state.fileName,
      state.videoRef,
      state.startTime,
      state.endTime,
      state.duration,
      state.initTime,
      state.setStartTime,
      state.setEndTime,
    ])
  );

  const handleOnLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
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
        startTime={startTime}
        endTime={endTime}
      />

      <VideoScrubber 
        videoRef={videoRef} 
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        duration={duration}
      />
    </AddModalSection>
  )
}