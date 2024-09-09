import { Raycaster, Vector2, Mesh } from "three";
import type { Object3D } from "three";
import type { Camera } from "@react-three/fiber";
import type { WeaponStats } from "../../weapon";
import type { PlayerState } from "@fps/lib";

interface ShootProps {
    camera: Camera;
    playerStateRef: React.MutableRefObject<PlayerState>;
    stats: WeaponStats;
}

export const shoot = (props: ShootProps) => {};

// TODO: Add this back in later
// const applyRecoil = (stats: WeaponStats) => {
//     // Recoil factors from the weapon stats
//     const horizontalRecoil = stats.recoil.horizontal; // Side-to-side (yaw) recoil
//     const verticalRecoil = stats.recoil.vertical; // Upward (pitch) recoil
//     const recoilKickback = stats.recoil.kickback; // Backward translation (how much the weapon kicks backward)

//     // Randomize the recoil a bit for realism
//     const randomFactor = (factor: number) => (Math.random() - 0.5) * factor;

//     const recoilX = verticalRecoil + randomFactor(verticalRecoil * 0.1); // Pitch recoil (upward/downward)
//     const recoilY = randomFactor(horizontalRecoil); // Yaw recoil (left/right)
//     const recoilZ = randomFactor(0.02); // Slight roll for added realism

//     // Kickback is always backward along the Z axis
//     const translateX = 0;
//     const translateY = 0;
//     const translateZ = recoilKickback;

//     return {
//         rotate: {
//             x: recoilX, // Pitch (vertical recoil)
//             y: recoilY, // Yaw (horizontal recoil)
//             z: recoilZ, // Roll (optional)
//         },
//         translate: {
//             x: translateX,
//             y: translateY,
//             z: translateZ, // Backward movement due to recoil
//         },
//     };
// };
