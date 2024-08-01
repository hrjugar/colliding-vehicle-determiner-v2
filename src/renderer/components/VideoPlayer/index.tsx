import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { cn } from "../../utils/style";
import { convertSecondsToTimeText } from "../../utils/time";
import TimeInput from "../TimeInput";
import { RiFullscreenLine, RiPauseFill, RiPlayFill, RiRewindMiniFill } from "@remixicon/react";
import VideoButton from "./VideoButton";

interface VideoPlayerProps {
  className?: string;
  fileName: string;
  videoProps?: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
  startTime?: number;
  endTime?: number;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>((props, videoRef) => {
  const { 
    className, 
    fileName, 
    videoProps = {},
    startTime,
    endTime,
  } = props;
  
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const innerVideoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(videoRef, () => innerVideoRef.current as HTMLVideoElement);
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const handleLoadedMetadata = useCallback(() => {
    if (innerVideoRef.current) {
      setDuration(innerVideoRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (innerVideoRef.current) {
      if (endTime !== undefined && innerVideoRef.current.currentTime > endTime) {
        let newStartTime = startTime ?? 0;
        innerVideoRef.current.pause();
        setIsPaused(true);
        innerVideoRef.current.currentTime = newStartTime;
      } else {
        setCurrentTime(innerVideoRef.current.currentTime);
      }
    }
  }, [startTime, endTime]);

  const handleOnEnded = useCallback(() => {
    if (innerVideoRef.current) {
      setIsPaused(true);
      innerVideoRef.current.currentTime = startTime ?? 0;
    }
  }, [startTime]);

  const toggleFullScreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current?.requestFullscreen();
      }
    }
  }, []);

  const rewindVideo = useCallback(() => {
    if (innerVideoRef.current) {
      let newTime = innerVideoRef.current.currentTime - 5;
      if (startTime !== undefined) {
        newTime = Math.max(newTime, startTime);
      }

      innerVideoRef.current.currentTime = newTime;
    }
  }, [startTime]);

  const forwardVideo = useCallback(() => {
    if (innerVideoRef.current) {
      let newTime = innerVideoRef.current.currentTime + 5;
      if (endTime !== undefined) {
        newTime = Math.min(newTime, endTime);
      }

      innerVideoRef.current.currentTime = newTime;
    }
  }, [endTime]);

  return (
    <div
      ref={videoContainerRef} 
      className={cn(
        "group relative flex-grow basis-px flex justify-center items-center bg-cool-gray-100 rounded-lg overflow-hidden", 
        className
      )}
    >
      <video
        className="w-full h-full object-contain"
        key={`video-${fileName}`}
        ref={innerVideoRef}
        {...videoProps}
        onLoadedMetadata={(e) => {
          if (videoProps.onLoadedMetadata) {
            videoProps.onLoadedMetadata(e);
          }
          
          handleLoadedMetadata();
        }}
        onTimeUpdate={(e) => {
          if (videoProps.onTimeUpdate) {
            videoProps.onTimeUpdate(e);
          }

          handleTimeUpdate();
        }}
        onEnded={(e) => {
          if (videoProps.onEnded) {
            videoProps.onEnded(e);
          }

          handleOnEnded();
        }}
      >
        <source src={`video://${fileName}`} type="video/mp4" />
      </video>

      <div 
        className={`
          absolute bottom-0 w-full h-12 flex justify-between items-center text-sm px-6 bg-cool-gray-900 transition-transform duration-500
          ${isPaused ? "translate-y-0" : "translate-y-12"}
          group-hover:translate-y-0
        `}
      >
        <div className="flex-1 flex flex-row justify-start items-center gap-2 font-medium">
          <TimeInput 
            time={currentTime} 
            maxTime={duration} 
            setTime={(time) => {
              if (innerVideoRef.current) {
                innerVideoRef.current.currentTime = time;
              }
            }}
            className="text-cool-gray-300"
          />
          <span className="text-cool-gray-400">/</span>
          <span className="text-cool-gray-400">{convertSecondsToTimeText(duration)}</span>
        </div>

        <div className="flex-1 flex flex-row justify-center items-center gap-4">
          <VideoButton 
            disabled={!innerVideoRef.current}
            icon={RiRewindMiniFill}
            onClick={rewindVideo}
          />

          {isPaused ? (
            <VideoButton 
              disabled={!innerVideoRef.current}
              icon={RiPlayFill}
              iconSize={24}
              onClick={() => {
                if (innerVideoRef.current) {
                  innerVideoRef.current.play();
                  setIsPaused(false);
                }
              }}
            />
          ) : (
            <VideoButton 
              disabled={!innerVideoRef.current}
              icon={RiPauseFill}
              iconSize={24}
              onClick={() => {
                if (innerVideoRef.current) {
                  innerVideoRef.current.pause();
                  setIsPaused(true);
                }
              }}
            />            
          )}

          <VideoButton 
            disabled={!innerVideoRef.current}
            icon={RiRewindMiniFill}
            className="transform rotate-180"
            onClick={forwardVideo}
          />
        </div>
        
        <div className="flex-1 flex flex-row justify-end items-center">
          <VideoButton
            disabled={!videoContainerRef.current}
            icon={RiFullscreenLine}
            onClick={toggleFullScreen}
          />
        </div>
      </div>
    </div>
  )
});

export default VideoPlayer;