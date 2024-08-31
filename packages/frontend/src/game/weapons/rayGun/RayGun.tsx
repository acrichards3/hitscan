import React from "react";
import RayGunMesh from "./ray_gun.glb";
import { Vector3 } from "three";
import { WeaponChild } from "../WeaponChild";
import type { WeaponStats } from "../weapon";

export const RayGun: React.FC = () => {
    const rayGunStats: WeaponStats = {
        adsTimeMs: 0,
        bulletSpread: 0,
        bulletsPerMagazine: 10,
        bulletsPerShot: 1,
        damageType: "Ballistic",
        fireRateMs: 100,
        firingMode: "Single",
        horizontalRecoil: 0,
        maxDamagePerBullet: 10,
        name: "Ray Gun",
        reloadTimeMs: 1000,
        reserveAmmo: 100,
        verticalRecoil: 0,
        weaponClass: "Pistol",
        weight: 1,
    };

    // Prob have to fix these if we wanna use this component still
    return (
        <group dispose={null}>
            <WeaponChild
                adsOffset={new Vector3(0, -0.14, -0.1)}
                adsRotation={new Vector3(0.02, 0, 0)}
                idleOffset={new Vector3(-0.4, -0.2, 0.6)}
                idleRotation={new Vector3(0, 0, 0)}
                meshPath={RayGunMesh}
                scale={0.0035}
                stats={rayGunStats}
            />
        </group>
    );
};
