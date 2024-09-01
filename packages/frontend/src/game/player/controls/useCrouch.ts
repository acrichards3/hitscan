import React from "react";
import type { PlayerState } from "@fps/lib";

interface UseCrouchProps {
    gamepad: Gamepad | null | undefined;
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const useCrouch = () => {
    const wasCrouchPressed = React.useRef(false);

    const crouch = React.useCallback((props: UseCrouchProps) => {
        if (props.gamepad == null) return;

        const isCrouchPressed = !!props.gamepad.buttons[1]?.pressed;

        // Toggle crouch state only when the crouch button is pressed and was not pressed in the previous frame
        if (isCrouchPressed && !wasCrouchPressed.current) {
            props.playerStateRef.current.isCrouching = !props.playerStateRef.current.isCrouching;
        }

        // Update the previous state of the crouch button
        wasCrouchPressed.current = isCrouchPressed;
    }, []);

    return { crouch };
};
