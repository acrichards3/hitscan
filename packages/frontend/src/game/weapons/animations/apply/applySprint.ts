import { sprint } from "../functions/sprint";
import type { Group, Vector3 } from "three";

interface ApplySprint {
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

export const applySprint = (props: ApplySprint) => {
    const { group, idleOffset, idleRotation } = props;

    group.rotateX(idleRotation.x + sprint().rotate.x);
    group.rotateY(idleRotation.y + sprint().rotate.y);
    group.rotateZ(idleRotation.z + sprint().rotate.z);
    group.translateX(idleOffset.x + sprint().translate.x);
    group.translateY(idleOffset.y + sprint().translate.y);
    group.translateZ(idleOffset.z + sprint().translate.z);
};
