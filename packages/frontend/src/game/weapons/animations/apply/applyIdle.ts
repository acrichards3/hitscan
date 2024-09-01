import { idle } from "../../functions/weaponAnimations";
import type { Group, Vector3 } from "three";

interface ApplyIdle {
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

export const applyIdle = (props: ApplyIdle) => {
    const { group, idleOffset, idleRotation } = props;

    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(idleOffset.x + idle().x);
    group.translateY(idleOffset.y + idle().y);
    group.translateZ(idleOffset.z);
};
