import lottieManekiCat from "@sanipatitas/ui/assets/lottie/maneki-cat.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function ManekiCatAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} data={lottieManekiCat} />
}
