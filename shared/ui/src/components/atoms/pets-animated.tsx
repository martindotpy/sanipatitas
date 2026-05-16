import lottiePets from "@sanipatitas/ui/assets/lottie/pets.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function PetsAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} speed={0.75} src={lottiePets} />
}
