import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScrubberHandle from "./ScrubberHandle";
import ScrubberTimeIndicator from "./ScrubberTimeIndicator";

interface VideoScrubberProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  startTime: number;
  setStartTime: (startTime: number) => void;
  endTime: number;
  setEndTime: (time: number) => void;
  duration: number;
}

export default function VideoScrubber({
  videoRef,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  duration
}: VideoScrubberProps) {
  const startTrimPercentage = duration === 0 ? 0 : (startTime / duration) * 100;
  const endTrimPercentage = duration === 0 ? 100 : (endTime / duration) * 100;
  
  const areaRef = useRef<HTMLDivElement>(null);

  const handleSelectedAreaClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    if (videoRef.current && areaRef.current) {
      const areaRect = areaRef.current.getBoundingClientRect();
      const newPosition = e.clientX - areaRect.left;
      const newPositionPercentage = newPosition / areaRect.width;

      const newTime = newPositionPercentage * duration;
      videoRef.current.currentTime = newTime;
    }
  }, [duration]);

  return (
    <div className="relative w-full min-h-20 flex flex-row justify-center items-stretch rounded-lg px-4 py-1">
      <div 
        ref={areaRef}
        className="relative flex-grow bg-cool-gray-200"
      >
        <ScrubberTimeIndicator 
          videoRef={videoRef}
          startTime={startTime}
          endTime={endTime}
          duration={duration}
        />
      </div>

      <div 
        className="absolute top-0 bottom-0 left-0 right-0 h-full flex flex-row justify-start items-stretch mx-auto my-auto"
        style={{ 
          width: `calc(100% - 2rem)`,
        }}
      >
        <div 
          className="bg-black/25 my-1" 
          style={{ width: `${startTrimPercentage}%` }}
        />

        <div
          className="flex-grow border-y-4 border-indigo-400" 
          onClick={handleSelectedAreaClick}
        />

        <div 
          className="bg-black/25 my-1"
          style={{ left: `${endTrimPercentage}%`, width: `${100 - endTrimPercentage}%` }}
        />
      </div>

      <div 
        className="absolute top-0 left-0 right-0 h-full mx-auto pointer-events-none"
        style={{ width: `calc(100% - 1rem)`}}
      >
        <ScrubberHandle 
          isLeftHandle
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          duration={duration}
        />

        <ScrubberHandle 
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          duration={duration}
        />
      </div>
    </div>
  )
}