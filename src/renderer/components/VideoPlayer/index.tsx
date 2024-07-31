import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { cn } from "../../utils/style";
import { convertSecondsToTimeText } from "../../utils/time";
import TimeInput from "../TimeInput";
import { RiFullscreenLine, RiPauseFill, RiPlayFill, RiRewindMiniFill } from "@remixicon/react";
import VideoButton from "./VideoButton";

interface VideoPlayerProps {
  className?: string;
  fileName: string;
  videoProps?: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
}

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>((props, videoRef) => {
  const { className, fileName, videoProps = {} } = props;
  
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const innerVideoRef = useRef<HTMLVideoElement>(null);
  useImperativeHandle(videoRef, () => innerVideoRef.current as HTMLVideoElement);
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const handleLoadedMetadata = () => {
    if (innerVideoRef.current) {
      setDuration(innerVideoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (innerVideoRef.current) {
      setCurrentTime(innerVideoRef.current.currentTime);
    }
  }

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current?.requestFullscreen();
      }
    }
  }

  return (
    <div
      ref={videoContainerRef} 
      className={cn(
        "group relative flex-grow flex justify-center items-center bg-cool-gray-800 rounded-lg overflow-hidden", 
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

          setIsPaused(true);
        }}
      >
        <source src={`video://${fileName}`} type="video/mp4" />
      </video>

      <div 
        className={`
          absolute bottom-0 w-full h-12 flex justify-between items-center text-sm px-6 bg-cool-gray-800 transition-transform duration-500
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
            onClick={() => {
              if (innerVideoRef.current) {
                innerVideoRef.current.currentTime -= 5;
              }
            }}
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
            onClick={() => {
              if (innerVideoRef.current) {
                innerVideoRef.current.currentTime += 5;
              }
            }}
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