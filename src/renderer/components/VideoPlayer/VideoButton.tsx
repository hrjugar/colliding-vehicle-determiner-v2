import { RemixiconComponentType } from "@remixicon/react"
import { cn } from "../../utils/style";

interface VideoButtonProps {
  icon: RemixiconComponentType;
  iconSize?: number;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function VideoButton({
  icon,
  iconSize = 18,
  className,
  disabled,
  onClick
} : VideoButtonProps) {
  const VideoButtonIcon = icon;

  return (
    <button 
      type="button"
      className={cn(
        "text-white disabled:text-cool-gray-500",
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <VideoButtonIcon size={iconSize} />
    </button>
  )
}