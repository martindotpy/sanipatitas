import { Player } from "@lottiefiles/react-lottie-player"
import { cn } from "@sanipatitas/ui/lib/tailwind"

// Type
export type LottieAnimatedProps = Omit<LottieAnimatedBaseProps, "src">

// Component
type LottieAnimatedBaseProps = React.ComponentProps<typeof Player>

export function LottieAnimatedBase({
  className,
  ...props
}: LottieAnimatedBaseProps) {
  return (
    <Player
      autoplay
      loop
      className={cn("**:stroke-primary", className)}
      {...props}
    />
  )
}
