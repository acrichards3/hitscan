import React from "react";
import { crouchAndProne } from "../controls/crouchAndProne";
import { jump } from "../controls/jump";
import { move } from "../controls/move";
import { shoot } from "../controls/shoot";
import { useFrame } from "@react-three/fiber";
import type { WeaponStats } from "../../weapons/weapon";
import type { Capsule } from "three/examples/jsm/Addons.js";
import type { Euler, Vector3 } from "three";
import type { PlayerState } from "@fps/lib";

interface UseControlsProps {
    activeWeaponRef: React.MutableRefObject<WeaponStats>;
    capsule: Capsule;
    euler: Euler;
    playerDirection: Vector3;
    playerOnFloor: React.MutableRefObject<boolean>;
    playerStateRef: React.MutableRefObject<PlayerState>;
    playerVelocity: Vector3;
}

export const useControls = (props: UseControlsProps) => {
    // Crouch and prone state
    const wasCrouchPressed = React.useRef(false);
    const crouchHoldStart = React.useRef<number | null>(null);
    const currentHeight = React.useRef(1.0);
    const proneAttempted = React.useRef(false);

    // Jump state
    const wasJumpPressed = React.useRef(false);
    const lastCrouchTime = React.useRef(0);
    const lastProneTime = React.useRef(0);

    // Shoot state
    const wasShootPressed = React.useRef(false);
    const lastShotTime = React.useRef(0);

    useFrame(({ camera, clock }, delta) => {
        const [gamepad] = navigator.getGamepads();
        if (gamepad == null) return;

        crouchAndProne({
            capsule: props.capsule,
            clock,
            crouchHoldStart,
            currentHeight,
            gamepad,
            playerStateRef: props.playerStateRef,
            proneAttempted,
            wasCrouchPressed,
        });

        jump({
            clock,
            gamepad,
            lastCrouchTime,
            lastProneTime,
            playerOnFloor: props.playerOnFloor.current,
            playerStateRef: props.playerStateRef,
            playerVelocity: props.playerVelocity,
            wasJumpPressed,
        });

        move({
            camera,
            delta,
            euler: props.euler,
            gamepad,
            playerDirection: props.playerDirection,
            playerOnFloor: props.playerOnFloor.current,
            playerStateRef: props.playerStateRef,
            playerVelocity: props.playerVelocity,
        });

        shoot({
            activeWeaponRef: props.activeWeaponRef,
            clock,
            gamepad,
            lastShotTime,
            playerStateRef: props.playerStateRef,
            wasShootPressed,
        });
    });
};
