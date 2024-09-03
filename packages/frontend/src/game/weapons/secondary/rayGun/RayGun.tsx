import RayGunMesh from "./ray_gun.glb";
import { Vector3 } from "three";
import { WeaponChild } from "../../WeaponChild";
import { WEAPONS } from "../../weapon";
import type React from "react";
import type { PlayerState } from "@fps/lib";

interface RayGunProps {
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const RayGun: React.FC<RayGunProps> = ({ playerStateRef }) => {
    return (
        <group dispose={null}>
            <WeaponChild
                adsOffset={new Vector3(0, -0.14, -0.1)}
                adsRotation={new Vector3(0.02, 0, 0)}
                idleOffset={new Vector3(-0.4, -0.2, 0.6)}
                idleRotation={new Vector3(0, 0, 0)}
                meshPath={RayGunMesh}
                playerStateRef={playerStateRef}
                scale={0.0035}
                stats={WEAPONS.RayGun}
            />
        </group>
    );
};
