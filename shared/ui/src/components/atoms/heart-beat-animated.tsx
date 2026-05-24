import lottieHeartBeat from "@sanipatitas/ui/assets/lottie/heart-beat.json"
import {
  LottieAnimatedBase,
  type LottieAnimatedProps,
} from "@sanipatitas/ui/components/atoms/lottie-animated-base"

// Component
export function HeartBeatAnimated(props: LottieAnimatedProps) {
  return <LottieAnimatedBase {...props} data={lottieHeartBeat} />
}
