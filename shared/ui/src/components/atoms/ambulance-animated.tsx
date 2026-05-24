import lottieAmbulance from "@sanipatitas/ui/assets/lottie/ambulance.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function AmbulanceAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} data={lottieAmbulance} />
}
