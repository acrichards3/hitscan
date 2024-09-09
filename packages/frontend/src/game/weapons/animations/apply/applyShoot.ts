import { shoot } from "../functions/shoot";
import type { PlayerState } from "@fps/lib";
import type { WeaponStats } from "../../weapon";
import type { Camera } from "@react-three/fiber";
import type { Group, Vector3, Clock } from "three";

interface ApplyShoot {
    camera: Camera;
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    playerStateRef: React.MutableRefObject<PlayerState>;
    stats: WeaponStats;
}

export const applyShoot = (props: ApplyShoot) => {
    const { camera, clock, group, idleOffset, idleRotation, playerStateRef, stats } = props;

    shoot({ camera, playerStateRef, stats });
};

// TODO: Reimplement recoil
// // Camera movement (The actual recoil)
// if (playerStateRef.current.isAiming) {
//     camera.rotateX(shoot(stats).rotate.x); // Verical recoil
//     camera.rotateY(shoot(stats).rotate.y); // Horizontal recoil
//     camera.translateX(shoot(stats).translate.x);
//     camera.translateY(shoot(stats).translate.y);
// }

// // Physical gun movement (used mostly for hipfire)
// group.translateY(shoot(stats).rotate.y);
// group.translateZ(shoot(stats).translate.z);
