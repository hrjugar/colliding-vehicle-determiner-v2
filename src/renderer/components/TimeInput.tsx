import { useMemo } from "react";
import { padZero } from "../utils/time";
import { cn } from "../utils/style";

interface TimeInputProps {
  time: number;
  maxTime: number;
  setTime: (time: number) => void;
  className?: string;
}

export default function TimeInput({
  time,
  maxTime,
  setTime,
  className
}: TimeInputProps) {
  const hours = useMemo(() => Math.floor(time / 3600), [time]);
  const minutes = useMemo(() => Math.floor(time % 3600 / 60), [time]);
  const seconds = useMemo(() => Math.floor(time % 60), [time]);
  const milliseconds = useMemo(() => Math.round((time % 1) * 100), [time]);

  return (
    <div className={cn("flex flex-row justify-start items-center", className)}>
      <input
        className="w-[2ch] bg-transparent"
        value={padZero(hours)}
        onChange={(e) => {
          const newHours = parseInt(e.target.value);
          const newTime = newHours * 3600 + minutes * 60 + seconds + milliseconds / 100;
          if (newTime >= 0 && newTime <= maxTime) {
            setTime(newTime);
          }
        }}
      />

      <span>:</span>

      <input 
        className="w-[2ch] bg-transparent"
        value={padZero(minutes)} 
        onChange={(e) => {
          const newMinutes = parseInt(e.target.value);
          const newTime = hours * 3600 + newMinutes * 60 + seconds + milliseconds / 100;
          if (newTime >= 0 && newTime <= maxTime) {
            setTime(newTime);
          }
        }}
      />

      <span>:</span>

      <input 
        className="w-[2ch] bg-transparent"
        value={padZero(seconds)} 
        onChange={(e) => {
          const newSeconds = parseInt(e.target.value);
          const newTime = hours * 3600 + minutes * 60 + newSeconds + milliseconds / 100;
          if (newTime >= 0 && newTime <= maxTime) {
            setTime(newTime);
          }
        }}
      />

      <span>.</span>

      <input
        className="w-[2ch] bg-transparent"
        value={padZero(milliseconds)}
        onChange={(e) => {
          const newMilliseconds = parseInt(e.target.value);
          const newTime = hours * 3600 + minutes * 60 + seconds + newMilliseconds / 100;
          if (newTime >= 0 && newTime <= maxTime) {
            setTime(newTime);
          }
        }}
      />
    </div>
  )
}