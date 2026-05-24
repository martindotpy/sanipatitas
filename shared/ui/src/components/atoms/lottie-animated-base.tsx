import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { cn } from "@sanipatitas/ui/lib/tailwind"

// Type
export type LottieAnimatedProps = Omit<LottieAnimatedBaseProps, "data">

// Component
type LottieAnimatedBaseProps = React.ComponentProps<typeof DotLottieReact>

export function LottieAnimatedBase({
  className,
  ...props
}: LottieAnimatedBaseProps) {
  return (
    <DotLottieReact
      autoplay
      loop
      className={cn("dark:invert", className)}
      {...props}
    />
  )
}
