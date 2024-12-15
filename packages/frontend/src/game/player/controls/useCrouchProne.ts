import React from "react";
import { MathUtils } from "three";
import type { Capsule } from "three/examples/jsm/Addons.js";
import type { PlayerState } from "@fps/lib";

interface UseCrouchProneProps {
    capsule: Capsule;
    gamepad: Gamepad | null | undefined;
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const useCrouchProne = () => {
    const wasCrouchPressed = React.useRef(false);
    const crouchHoldStart = React.useRef<number | null>(null);
    const currentHeight = React.useRef(1.0);
    const proneAttempted = React.useRef(false);

    // * Handles crouch and prone *
    const crouchProne = React.useCallback((props: UseCrouchProneProps) => {
        if (props.gamepad == null) return;

        const isCrouchPressed = !!props.gamepad.buttons[1]?.pressed;
        const isJumpPressed = !!props.gamepad.buttons[0]?.pressed;

        // If jump is pressed, stand up from any crouch or prone state
        if (isJumpPressed) {
            props.playerStateRef.current.isCrouching = false;
            props.playerStateRef.current.isProne = false;
            crouchHoldStart.current = null; // Reset hold timer
            proneAttempted.current = false; // Reset prone attempt flag
            return;
        }

        // Handle crouch/prone state when the button is pressed
        if (isCrouchPressed && !wasCrouchPressed.current) {
            crouchHoldStart.current = performance.now(); // Start timer for prone
            proneAttempted.current = false; // Reset prone attempt flag

            // If player is prone, pressing crouch brings them to crouch
            if (props.playerStateRef.current.isProne) {
                props.playerStateRef.current.isProne = false;
                props.playerStateRef.current.isCrouching = true;
            } else {
                // Toggle crouch state immediately
                props.playerStateRef.current.isCrouching =
                    !props.playerStateRef.current.isCrouching;
            }
        }

        // Handle hold for prone
        if (isCrouchPressed && wasCrouchPressed.current) {
            const elapsed = performance.now() - (crouchHoldStart.current ?? 0);

            // If the button is held long enough to go prone (400ms)
            if (elapsed >= 400 && !proneAttempted.current) {
                props.playerStateRef.current.isProne = true;
                props.playerStateRef.current.isCrouching = false; // Disable crouch when prone
                proneAttempted.current = true; // Mark that prone was attempted
            }
        }

        // Handle release of crouch button
        if (!isCrouchPressed && wasCrouchPressed.current) {
            crouchHoldStart.current = null; // Reset hold timer
        }

        // Determine target height based on crouch/prone state
        let targetHeight = 1.0; // default height
        if (props.playerStateRef.current.isCrouching) {
            targetHeight = 0.5;
        }
        if (props.playerStateRef.current.isProne) {
            targetHeight = 0.0; // or whatever height represents prone
        }

        // Smoothly interpolate the capsule height towards the target height
        currentHeight.current = MathUtils.lerp(currentHeight.current, targetHeight, 0.1);
        props.capsule.end.y = props.capsule.start.y + currentHeight.current;

        // Update the previous state of the crouch button
        wasCrouchPressed.current = isCrouchPressed;
    }, []);

    return { crouchProne };
};
