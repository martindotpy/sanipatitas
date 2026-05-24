import lottieCat from "@sanipatitas/ui/assets/lottie/cat.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function CatAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} data={lottieCat} />
}
