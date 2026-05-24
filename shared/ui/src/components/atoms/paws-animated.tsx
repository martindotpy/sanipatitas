import lottiePaws from "@sanipatitas/ui/assets/lottie/paws.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function PawsAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} data={lottiePaws} />
}
