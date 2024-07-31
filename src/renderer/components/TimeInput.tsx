import { Time } from "../../types";

interface TimeInputProps {
  time: Time;
  maxTime: Time;
  setTime: (time: Time) => void;
}

export default function TimeInput({
  time,
  maxTime,
  setTime
}: TimeInputProps) {
  return (
    <div className="flex flex-row justify-start items-center">
      <input 
        value={time.hours} 
        onChange={(e) => {
          const hours = parseInt(e.target.value);
          if (hours >= 0 && hours < 24 && hours > maxTime.hours) {
            setTime({ ...time, hours });
          }
        }}
      />

      <span>:</span>

      <input 
        value={time.minutes} 
        onChange={(e) => {
          const minutes = parseInt(e.target.value);
          if (
            minutes >= 0 && minutes < 60 &&
            (time.hours === maxTime.hours ? minutes <= maxTime.minutes : true)
          ) {
            setTime({ ...time, minutes });
          }
        }}
      />

      <span>:</span>

      <input 
        value={time.seconds} 
        onChange={(e) => {
          const seconds = parseInt(e.target.value);
          if (
            seconds >= 0 && seconds < 60 &&
            (
              (
                time.hours === maxTime.hours && 
                time.minutes === maxTime.minutes
              ) ? 
                seconds <= maxTime.seconds : 
                true
            )
          ) {
            setTime({ ...time, seconds });
          }
        }}
      />

      <span>.</span>

      <input
        value={time.milliseconds}
        onChange={(e) => {
          const milliseconds = parseInt(e.target.value);
          if (
            milliseconds >= 0 && milliseconds < 100 &&
            (
              (
                time.hours === maxTime.hours && 
                time.minutes === maxTime.minutes && 
                time.seconds === maxTime.seconds
              ) ? 
                milliseconds <= maxTime.milliseconds : 
                true
            )
          ) {
            setTime({ ...time, milliseconds });
          }
        }}
      />
    </div>
  )
}