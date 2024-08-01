import { useEffect, useRef, useState } from "react";

interface ScrubberTimeIndicatorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  startTime: number;
  endTime: number;
}

export default function ScrubberTimeIndicator({
  videoRef,
  startTime,
  endTime,
}: ScrubberTimeIndicatorProps) {
  const [videoProgressPercentage, setVideoProgressPercentage] = useState(0);
  const timeIndicatorRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();

    if (videoRef.current && timeIndicatorRef.current) {
      const parentRect = timeIndicatorRef.current.parentElement!.getBoundingClientRect();
      const newPosition = (e.clientX - parentRect.left);
      const newPositionPercentage = newPosition / parentRect.width;

      const newTime = Math.max(
        Math.min(
          newPositionPercentage * videoRef.current.duration,
          endTime,
        ),
        startTime
      );
      videoRef.current.currentTime = newTime;
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault();
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;

      setVideoProgressPercentage((currentTime / duration) * 100);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);

      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    }
  }, []);  

  return (
    <div
      ref={timeIndicatorRef}
      onPointerDown={handlePointerDown}
      className="absolute z-10 top-0 h-full w-0.5 bg-orange-400 cursor-pointer -translate-x-1/2 scale-y-125"
      style={{
        left: `${videoProgressPercentage}%`
      }}
    />
  )
}