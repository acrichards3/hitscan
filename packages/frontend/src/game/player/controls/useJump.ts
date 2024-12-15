import React from "react";
import type { PlayerControls } from "../Player";

type JumpProps = Pick<
    PlayerControls,
    "gamepad" | "playerOnFloor" | "playerVelocity" | "playerStateRef"
>;

export const useJump = () => {
    const wasJumpPressed = React.useRef(false);
    const lastCrouchTime = React.useRef(0);
    const lastProneTime = React.useRef(0);

    const jump = (props: JumpProps) => {
        const player = props.playerStateRef.current;
        if (props.gamepad == null) return;

        const isJumpPressed = !!props.gamepad.buttons[0]?.pressed;
        const currentTime = performance.now();

        // Track the time the player transitions to crouching or prone
        if (player.isCrouching) {
            lastCrouchTime.current = currentTime;
        }
        if (player.isProne) {
            lastProneTime.current = currentTime;
        }

        // Define a delay (e.g., 500ms) before allowing a jump after crouching or prone
        const crouchDelay = 500;
        const proneDelay = 500;

        const isCrouchDelayOver = currentTime - lastCrouchTime.current > crouchDelay;
        const isProneDelayOver = currentTime - lastProneTime.current > proneDelay;

        const allowedToJump =
            props.playerOnFloor &&
            !wasJumpPressed.current &&
            !player.isProne &&
            !player.isCrouching &&
            isCrouchDelayOver &&
            isProneDelayOver;

        console.log(allowedToJump);

        // Allow jump only if the player is on the floor, the jump button is pressed, and it was not pressed in the previous frame
        if (allowedToJump && isJumpPressed) {
            props.playerVelocity.y += 15;
            player.isJumping = true; // Update isJumping when the player jumps
        }

        // If the jump button is released, reset isJumping
        if (!isJumpPressed && wasJumpPressed.current) {
            props.playerStateRef.current.isJumping = false;
        }

        // Update the previous state of the jump button
        wasJumpPressed.current = isJumpPressed;
    };

    return { jump };
};
