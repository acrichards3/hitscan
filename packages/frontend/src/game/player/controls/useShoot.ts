import React from "react";
import type { WeaponStats } from "../../weapons/weapon";
import type { PlayerControls } from "../Player";

type ShootProps = Pick<PlayerControls, "playerStateRef" | "gamepad"> & {
    activeWeaponRef: React.MutableRefObject<WeaponStats>;
};

export const useShoot = () => {
    const wasShootPressed = React.useRef(false);

    const shoot = (props: ShootProps) => {
        if (props.gamepad == null) return;

        const isShootPressed = !!props.gamepad.buttons[7]?.pressed;
        const firingMode = props.activeWeaponRef.current.firingMode; // Can be "Single" | "Auto"

        if (firingMode === "Auto") {
            props.playerStateRef.current.isShooting = isShootPressed;
        }

        // TODO: Add this feature
        if (firingMode === "Burst") {
            console.warn("Burst mode not implemented yet!");
        }

        if (firingMode === "Single") {
            if (isShootPressed && !wasShootPressed.current) {
                props.playerStateRef.current.isShooting = true;
            } else {
                props.playerStateRef.current.isShooting = false;
            }
        }

        wasShootPressed.current = isShootPressed;
    };

    return { shoot };
};
