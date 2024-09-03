export type WeaponType = "Primary" | "Secondary" | "Other";

export type WeaponClass =
    | "Submachine Gun"
    | "Assault Rifle"
    | "Shotgun"
    | "Sniper Rifle"
    | "Pistol"
    | "Rocket Launcher"
    | "Grenade Launcher"
    | "Melee";

export type FiringMode = "Single" | "Burst" | "Auto";

export type DamageType = "Ballistic" | "Explosive" | "Melee";

// All time related fields should be set in milliseconds
// Player health is out of 100.0
// Note that recoil moves the camera, not the weapon!
export interface WeaponStats {
    adsTimeMs: number; // The time it takes to aim down sights when player is not sprinting
    bulletSpread: number; // The amount of bloom the weapon has. Should usually be 0 (unless the weapon is a shotgun)
    bulletsPerMagazine: number; // The amount of bullets the weapon can hold in a magazine
    bulletsPerShot: number; // Should be 1 unless the weapon is a shotgun (buckshot)
    damageType: DamageType; // The type of damage the weapon does (usually ballistic)
    displayName: string; // The name of the weapon that is displayed to the player
    fireRateMs: number; // The wait time between shots in milliseconds
    firingMode: FiringMode; // The firing mode of the weapon
    horizontalRecoil: number; // The amount of horizontal recoil the weapon has
    maxDamagePerBullet: number; // Maximum damage the weapon can do per bullet. Things like damagerange and bullet hit location should be handled in the game logic to reduce this number.
    reloadTimeMs: number; // The time it takes to reload the weapon in milliseconds
    reserveAmmo: number; // Recommended to be a multiple of bulletsPerMagazine
    shotsPerBurst?: number; // Only set if firingMode is "Burst"
    verticalRecoil: number; // The amount of vertical recoil the weapon has
    weaponClass: WeaponClass; // The class of the weapon
    weaponType: WeaponType; // The type of weapon
    weight: number; // Determines how fast the player can move with the weapon
}

// All weapons in the game
export type Weapon = "AK47" | "RayGun";

// All weapons with their stats
export const WEAPONS: Record<Weapon, WeaponStats> = {
    AK47: {
        adsTimeMs: 0,
        bulletSpread: 0,
        bulletsPerMagazine: 30,
        bulletsPerShot: 1,
        damageType: "Ballistic",
        displayName: "AK-47",
        fireRateMs: 100,
        firingMode: "Auto",
        horizontalRecoil: 0,
        maxDamagePerBullet: 10,
        reloadTimeMs: 1000,
        reserveAmmo: 100,
        verticalRecoil: 0,
        weaponClass: "Assault Rifle",
        weaponType: "Primary",
        weight: 1,
    },
    RayGun: {
        adsTimeMs: 0,
        bulletSpread: 0,
        bulletsPerMagazine: 10,
        bulletsPerShot: 1,
        damageType: "Ballistic",
        displayName: "Ray Gun",
        fireRateMs: 100,
        firingMode: "Single",
        horizontalRecoil: 0,
        maxDamagePerBullet: 10,
        reloadTimeMs: 1000,
        reserveAmmo: 100,
        verticalRecoil: 0,
        weaponClass: "Pistol",
        weaponType: "Secondary",
        weight: 1,
    },
};
