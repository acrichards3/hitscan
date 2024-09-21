import React from "react";
import type { PlayerControls } from "../Player";

type JumpProps = Pick<
    PlayerControls,
    "gamepad" | "playerOnFloor" | "playerVelocity" | "playerStateRef"
>;

export const useJump = () => {
    const wasJumpPressed = React.useRef(false);

    const jump = (props: JumpProps) => {
        if (props.gamepad == null) return;

        const isJumpPressed = !!props.gamepad.buttons[0]?.pressed;

        // Allow jump only if the player is on the floor, the jump button is pressed, and it was not pressed in the previous frame
        if (props.playerOnFloor && isJumpPressed && !wasJumpPressed.current) {
            // Only allow jumping if the player is not prone AND not crouching
            if (
                !props.playerStateRef.current.isProne &&
                !props.playerStateRef.current.isCrouching
            ) {
                props.playerVelocity.y += 15;
                props.playerStateRef.current.isJumping = true; // Update isJumping when the player jumps
            }
        }

        if (!isJumpPressed && wasJumpPressed.current) {
            // If the jump button is released, reset isJumping
            props.playerStateRef.current.isJumping = false;
        }

        // Update the previous state of the jump button
        wasJumpPressed.current = isJumpPressed;
    };

    return { jump };
};
