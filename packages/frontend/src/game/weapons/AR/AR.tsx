import React from "react";
import ARMesh from "./AR.glb";
import { Vector3 } from "three";
import { WeaponChild } from "../WeaponChild";
import type { WeaponStats } from "../weapon";

export const AR: React.FC = () => {
    const ARStats: WeaponStats = {
        adsTime: 0,
        bulletSpread: 0,
        bulletsPerMagazine: 30,
        bulletsPerShot: 1,
        damageType: "Ballistic",
        fireRate: 100,
        firingMode: "Single",
        horizontalRecoil: 0,
        maxDamagePerBullet: 10,
        name: "AR",
        reloadTime: 1000,
        reserveAmmo: 100,
        verticalRecoil: 0,
        weaponClass: "Assault Rifle",
        weight: 1,
    };

    return (
        <WeaponChild
            adsOffset={new Vector3(0, -0.14, -0.1)}
            adsRotation={new Vector3(0.02, 0, 0)}
            idleOffset={new Vector3(0.13, -0.18, -0.36)}
            idleRotation={new Vector3(0, 0, 0)}
            meshPath={ARMesh}
            scale={0.15}
            stats={ARStats}
        />
    );
};
