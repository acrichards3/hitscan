import AK47Mesh from "./AK47.glb";
import ShootSound from "./AK47.mp3";
import { Vector3 } from "three";
import { WeaponChild } from "../../WeaponChild";
import { WEAPONS } from "../../weapon";
import type React from "react";
import type { PlayerState } from "@fps/lib";

interface ARProps {
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const AK47: React.FC<ARProps> = ({ playerStateRef }) => {
    return (
        <WeaponChild
            adsOffset={new Vector3(0, -0.14, -0.1)}
            adsRotation={new Vector3(0.02, 0, 0)}
            idleOffset={new Vector3(0.13, -0.18, -0.36)}
            idleRotation={new Vector3(0, 0, 0)}
            meshPath={AK47Mesh}
            playerStateRef={playerStateRef}
            scale={0.15}
            shootBufferUrl={ShootSound}
            stats={WEAPONS.AK47}
        />
    );
};
