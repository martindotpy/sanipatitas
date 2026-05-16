import lottieInjection from "@sanipatitas/ui/assets/lottie/injection.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function InjectionAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} src={lottieInjection} />
}
