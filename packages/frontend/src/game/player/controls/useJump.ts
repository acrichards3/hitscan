import React from "react";
import type { PlayerControls } from "../playerControls";

type JumpProps = Pick<PlayerControls, "gamepad" | "playerOnFloor" | "playerVelocity">;

export const useJump = () => {
    const wasJumpPressed = React.useRef(false);

    const jump = (props: JumpProps) => {
        if (props.gamepad == null) return;

        const isJumpPressed = !!props.gamepad.buttons[0]?.pressed;

        // Allow jump only if the player is on the floor, the jump button is pressed, and it was not pressed in the previous frame
        if (props.playerOnFloor && isJumpPressed && !wasJumpPressed.current) {
            props.playerVelocity.y += 15;
        }

        // Update the previous state of the jump button
        wasJumpPressed.current = isJumpPressed;
    };

    return { jump };
};
