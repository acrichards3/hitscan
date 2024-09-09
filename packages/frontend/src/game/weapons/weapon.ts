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

export type Recoil = {
    horizontal: number; // Side to side recoil
    kickback: number; // Forward and backward recoil
    vertical: number; // Up and down recoil
};

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
    maxDamagePerBullet: number; // Maximum damage the weapon can do per bullet. Things like damagerange and bullet hit location should be handled in the game logic to reduce this number.
    recoil: Recoil; // The recoil of the weapon
    reloadTimeMs: number; // The time it takes to reload the weapon in milliseconds
    reserveAmmo: number; // Recommended to be a multiple of bulletsPerMagazine
    shotsPerBurst?: number; // Only set if firingMode is "Burst"
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
        maxDamagePerBullet: 10,
        recoil: {
            horizontal: 0.01,
            kickback: 0.1,
            vertical: 0.008,
        },
        reloadTimeMs: 1000,
        reserveAmmo: 100,
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
        maxDamagePerBullet: 10,
        recoil: {
            horizontal: 0.1,
            kickback: 5,
            vertical: 0.1,
        },
        reloadTimeMs: 1000,
        reserveAmmo: 100,
        weaponClass: "Pistol",
        weaponType: "Secondary",
        weight: 1,
    },
};
