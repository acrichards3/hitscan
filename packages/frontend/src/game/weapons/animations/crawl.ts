import { Vector3 } from "three";
import { lerpAnimation } from "./lerpAnimation";
import type { AnimationPosition } from "./hooks/useWeaponAnimations";
import type { Clock, Group } from "three";

interface CrawlProps {
    animationTransition: AnimationPosition;
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    walkingSpeed: number;
}

type Coordinate = { x: number; y: number; z: number };
type CrawlCoordinates = { rotate: Coordinate; translate: Coordinate };

export const crawl = (props: CrawlProps) => {
    const { animationTransition, clock, group, idleOffset, idleRotation, walkingSpeed } = props;

    const targetPosition = {
        rotateX: idleRotation.x + crawlCoordinates(clock, walkingSpeed).rotate.x,
        rotateY: idleRotation.y + crawlCoordinates(clock, walkingSpeed).rotate.y,
        rotateZ: idleRotation.z + crawlCoordinates(clock, walkingSpeed).rotate.z,
        translateX: idleOffset.x + crawlCoordinates(clock, walkingSpeed).translate.x,
        translateY: idleOffset.y + crawlCoordinates(clock, walkingSpeed).translate.y,
        translateZ: idleOffset.z + crawlCoordinates(clock, walkingSpeed).translate.z,
    };

    const lerp = lerpAnimation({ animationTransition, target: targetPosition });

    group.rotateX(lerp.rotateX);
    group.rotateY(lerp.rotateY);
    group.rotateZ(lerp.rotateZ);
    group.translateX(lerp.translateX);
    group.translateY(lerp.translateY);
    group.translateZ(lerp.translateZ);
};

const crawlCoordinates = (() => {
    let previousElapsedTime = 0;
    let currentFrequency = 0;
    let phase = 0;

    return (clock: Clock, movementSpeed: number): CrawlCoordinates => {
        const minFrequency = 2;
        const maxFrequency = 12;
        const amplitude = 0.01;

        // Match movement speed between min and max frequencies
        const targetFrequency = minFrequency + (maxFrequency - minFrequency) * movementSpeed;

        // Smooth frequency changes to avoid sudden jumps when movement speed changes
        const frequencySmoothingFactor = 0.1;
        currentFrequency += (targetFrequency - currentFrequency) * frequencySmoothingFactor;

        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousElapsedTime;
        previousElapsedTime = elapsedTime;

        phase += currentFrequency * deltaTime;

        const gunRotation = (Math.sin(phase) + amplitude) * 0.1 * 0.25;
        const circularMotion = -Math.cos(phase) * 0.1;

        const rotate = {
            x: 0.05 + circularMotion * 0.8,
            y: 1.3 + gunRotation * 5.2,
            z: 0 + gunRotation * 5,
        };

        const translate = {
            x: 0.18 + gunRotation * 0.1,
            y: -0.18 + gunRotation * 0.8,
            z: 0.4 + gunRotation * 0.4,
        };

        return { rotate, translate };
    };
})();
