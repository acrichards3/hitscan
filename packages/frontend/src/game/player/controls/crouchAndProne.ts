import React from "react";
import { MathUtils } from "three";
import type { Clock } from "three";
import type { Capsule } from "three/examples/jsm/Addons.js";
import type { PlayerState } from "@fps/lib";

interface UseCrouchProneProps {
    capsule: Capsule;
    clock: Clock;
    crouchStartTime: React.MutableRefObject<number>;
    currentHeight: React.MutableRefObject<number>;
    gamepad: Gamepad | null | undefined;
    lockCrouch: React.MutableRefObject<boolean>;
    playerStateRef: React.MutableRefObject<PlayerState>;
    timeSpentCrouching: React.MutableRefObject<number>;
    wasCrouchPressed: React.MutableRefObject<boolean>;
}

const TIME_TO_PRONE = 0.35;

export const crouchAndProne = (props: UseCrouchProneProps) => {
    if (props.gamepad == null) return;

    const { crouchStartTime, currentHeight, lockCrouch, timeSpentCrouching, wasCrouchPressed } =
        props;

    const playerState = props.playerStateRef.current;
    const isCrouchPressed = !!props.gamepad.buttons[1]?.pressed;
    const isJumpPressed = !!props.gamepad.buttons[0]?.pressed;
    const elapsedTime = props.clock.getElapsedTime();

    // ! - * CORE LOGIC *

    // * - Player is currently standing
    if (!playerState.isProne && !playerState.isCrouching && isCrouchPressed) {
        playerState.isCrouching = true;
        lockCrouch.current = true;
    }

    // * - Player is currently crouching or prone
    if (isCrouchPressed) {
        // This is the first frame crouch was pressed so start the timer
        if (!wasCrouchPressed.current) {
            crouchStartTime.current = elapsedTime;
        }

        // Time spent crouching is the current time minus the time crouch was pressed
        timeSpentCrouching.current = elapsedTime - crouchStartTime.current;

        // If holding the crouch button long enough, go prone
        if (timeSpentCrouching.current >= TIME_TO_PRONE) {
            playerState.isProne = true;
            playerState.isCrouching = false;
        }

        // If already prone
        if (playerState.isProne && timeSpentCrouching.current < TIME_TO_PRONE) {
            playerState.isProne = false;
            playerState.isCrouching = true;
            lockCrouch.current = true;
        }
    }

    // Detect a fresh crouch press and release the lock
    if (!isCrouchPressed && !wasCrouchPressed.current) {
        lockCrouch.current = false;
    }

    // Button was released
    if (!isCrouchPressed && wasCrouchPressed.current && !lockCrouch.current) {
        if (timeSpentCrouching.current < TIME_TO_PRONE) {
            playerState.isCrouching = false;
        }

        timeSpentCrouching.current = 0;
    }

    // If jump button is pressed, stand up from any crouch or prone state
    if (isJumpPressed) {
        playerState.isCrouching = false;
        playerState.isProne = false;
    }

    // If player starts sprinting, stand up from any crouch or prone state
    if (props.playerStateRef.current.isSprinting) {
        playerState.isCrouching = false;
        playerState.isProne = false;
    }

    // ! - * HEIGHT CALCULATIONS *

    // Determine target height based on crouch/prone state
    let targetHeight = 1.0; // default height

    if (props.playerStateRef.current.isCrouching) targetHeight = 0.5;
    if (props.playerStateRef.current.isProne) targetHeight = 0.0;

    // Smoothly interpolate the capsule height towards the target height
    currentHeight.current = MathUtils.lerp(currentHeight.current, targetHeight, 0.1);
    props.capsule.end.y = props.capsule.start.y + currentHeight.current;

    // Update the previous state of the crouch button
    wasCrouchPressed.current = isCrouchPressed;
};
