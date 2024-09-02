import { walk } from "../functions/walk";
import type { Group, Vector3, Clock } from "three";

interface ApplyWalk {
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    walkingSpeed: number;
}

export const applyWalk = (props: ApplyWalk) => {
    const { clock, group, idleOffset, idleRotation, walkingSpeed } = props;
    const walkingAmplitude = 0.01;

    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(idleOffset.x + walk(walkingAmplitude, clock, walkingSpeed).x);
    group.translateY(idleOffset.y + walk(walkingAmplitude, clock, walkingSpeed).y);
    group.translateZ(idleOffset.z);
};
