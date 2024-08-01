import { RiDraggable } from "@remixicon/react";
import { useEffect, useRef } from "react";

interface ScrubberHandleProps {
  isLeftHandle?: boolean;
  startTime: number;
  setStartTime: (startTime: number) => void;
  endTime: number;
  setEndTime: (endTime: number) => void;
  duration: number;
}

export default function ScrubberHandle({
  isLeftHandle,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  duration
}: ScrubberHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();
    const minimumTrimDuration = 0.5;
    const parentRect = handleRef.current?.parentElement!.getBoundingClientRect()!;
    const newPosition = (e.clientX - parentRect.left);
    const newPositionPercentage = newPosition / parentRect.width;

    if (isLeftHandle) {
      const newStartTime = Math.min(
        Math.max(
          newPositionPercentage * duration,
          0
        ),
        endTime - minimumTrimDuration
      );
      setStartTime(newStartTime);
    } else {
      const newEndTime = Math.max(
        Math.min(
          newPositionPercentage * duration,
          duration
        ),
        startTime + minimumTrimDuration
      );
      setEndTime(newEndTime);
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault();
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointermove', handlePointerMove);
    }
  }, []);

  return (
    <div 
      ref={handleRef}
      onPointerDown={handlePointerDown}
      className={`
        absolute top-0 w-4 h-full flex justify-center items-center bg-indigo-400 text-white cursor-pointer pointer-events-auto -translate-x-1/2
        ${isLeftHandle ? 'rounded-l-lg' : 'rounded-r-lg'}
      `}
      style={{
        left: isLeftHandle ? `${(startTime / duration) * 100}%` : `${(endTime / duration) * 100}%`
      }}
    >
      <RiDraggable size={18} />
    </div>
  )
}