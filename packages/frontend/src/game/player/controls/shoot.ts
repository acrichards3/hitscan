import React from "react";
import type { Clock } from "three";
import type { WeaponStats } from "../../weapons/weapon";
import type { PlayerControls } from "../Player";

type Shoot = Pick<PlayerControls, "playerStateRef" | "gamepad"> & {
    activeWeaponRef: React.MutableRefObject<WeaponStats>;
};

interface ShootProps extends Shoot {
    clock: Clock;
    lastShotTime: React.MutableRefObject<number>;
    wasShootPressed: React.MutableRefObject<boolean>;
}

export const shoot = (props: ShootProps) => {
    if (props.gamepad == null) return;

    const { lastShotTime, wasShootPressed } = props;

    const isShootPressed = !!props.gamepad.buttons[7]?.pressed;
    const firingMode = props.activeWeaponRef.current.firingMode;
    const fireRateMs = props.activeWeaponRef.current.fireRateMs / 1000; // Convert to seconds for getElapsedTime()

    const currentTime = props.clock.getElapsedTime();

    if (firingMode === "Auto") {
        // Auto fire (only shoot on button press AND weapon fire rate interval)
        if (isShootPressed && currentTime - lastShotTime.current >= fireRateMs) {
            props.playerStateRef.current.isShooting = true;
            lastShotTime.current = currentTime;
        } else {
            props.playerStateRef.current.isShooting = false;
        }
    }

    // TODO: Add this feature
    if (firingMode === "Burst") {
        console.warn("Burst mode not implemented yet!");
    }

    if (firingMode === "Single") {
        if (isShootPressed && !wasShootPressed.current) {
            props.playerStateRef.current.isShooting = true;
            lastShotTime.current = currentTime;
        } else {
            props.playerStateRef.current.isShooting = false;
        }
    }

    wasShootPressed.current = isShootPressed;
};
