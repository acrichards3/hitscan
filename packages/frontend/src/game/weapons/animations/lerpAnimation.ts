import { MathUtils } from "three";
import type { AnimationPosition } from "./hooks/useWeaponAnimations";

interface LerpAnimationProps {
    animationTransition: AnimationPosition;
    speed?: number;
    target: AnimationPosition;
}

/**
 * Used to smoothly transition between two animation states
 * @param props - The animation transition, speed of the transition, and target position
 * @returns The lerp values for the animation
 */
export const lerpAnimation = (props: LerpAnimationProps) => {
    const { animationTransition, target } = props;

    const lerpSpeed = props.speed ?? 0.1;

    const lerp = {
        rotateX: MathUtils.lerp(animationTransition.rotateX, target.rotateX, lerpSpeed),
        rotateY: MathUtils.lerp(animationTransition.rotateY, target.rotateY, lerpSpeed),
        rotateZ: MathUtils.lerp(animationTransition.rotateZ, target.rotateZ, lerpSpeed),
        translateX: MathUtils.lerp(animationTransition.translateX, target.translateX, lerpSpeed),
        translateY: MathUtils.lerp(animationTransition.translateY, target.translateY, lerpSpeed),
        translateZ: MathUtils.lerp(animationTransition.translateZ, target.translateZ, lerpSpeed),
    };

    animationTransition.rotateX = lerp.rotateX;
    animationTransition.rotateY = lerp.rotateY;
    animationTransition.rotateZ = lerp.rotateZ;
    animationTransition.translateX = lerp.translateX;
    animationTransition.translateY = lerp.translateY;
    animationTransition.translateZ = lerp.translateZ;

    return lerp;
};
