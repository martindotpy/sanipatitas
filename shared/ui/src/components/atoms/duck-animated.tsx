import lottieDuck from "@sanipatitas/ui/assets/lottie/duck.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function DuckAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} data={lottieDuck} />
}
