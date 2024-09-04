import React from "react";
import type { WeaponStats } from "../../weapons/weapon";
import type { PlayerControls } from "../Player";

type ShootProps = Pick<PlayerControls, "playerStateRef" | "gamepad"> & {
    activeWeaponRef: React.MutableRefObject<WeaponStats>;
};

export const useShoot = () => {
    const wasShootPressed = React.useRef(false);
    const lastShotTime = React.useRef(0);

    const shoot = (props: ShootProps) => {
        if (props.gamepad == null) return;

        const isShootPressed = !!props.gamepad.buttons[7]?.pressed;
        const firingMode = props.activeWeaponRef.current.firingMode;
        const fireRateMs = props.activeWeaponRef.current.fireRateMs;

        const currentTime = Date.now();

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

    return { shoot };
};
