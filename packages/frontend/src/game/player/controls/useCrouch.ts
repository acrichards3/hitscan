import React from "react";
import { MathUtils } from "three";
import type { Capsule } from "three/examples/jsm/Addons.js";
import type { PlayerState } from "@fps/lib";

interface UseCrouchProps {
    capsule: Capsule;
    gamepad: Gamepad | null | undefined;
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const useCrouch = () => {
    const wasCrouchPressed = React.useRef(false);
    const currentHeight = React.useRef(1.0); // Assume the initial height is 1.0

    const crouch = React.useCallback((props: UseCrouchProps) => {
        if (props.gamepad == null) return;

        const isCrouchPressed = !!props.gamepad.buttons[1]?.pressed;

        // Toggle crouch state only when the crouch button is pressed and was not pressed in the previous frame
        if (isCrouchPressed && !wasCrouchPressed.current) {
            props.playerStateRef.current.isCrouching = !props.playerStateRef.current.isCrouching;
        }

        // Determine target height based on crouch state
        const targetHeight = props.playerStateRef.current.isCrouching ? 0.5 : 1.0;

        // Smoothly interpolate the capsule height towards the target height using MathUtils.lerp
        currentHeight.current = MathUtils.lerp(currentHeight.current, targetHeight, 0.1); // Fixed interpolation rate
        props.capsule.end.y = props.capsule.start.y + currentHeight.current;

        // Update the previous state of the crouch button
        wasCrouchPressed.current = isCrouchPressed;
    }, []);

    return { crouch };
};
