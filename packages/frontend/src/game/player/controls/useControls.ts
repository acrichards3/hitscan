import React from "react";
import { useCrouchProne } from "./useCrouchProne";
import { useJump } from "./useJump";
import { useMove } from "./useMove";
import { useShoot } from "./useShoot";
import type { WeaponStats } from "../../weapons/weapon";
import type { Capsule } from "three/examples/jsm/Addons.js";
import type { Camera } from "@react-three/fiber";
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

interface HandleControlsProps {
    camera: Camera;
    delta: number;
    gamepad: Gamepad | null | undefined;
}

export const useControls = (props: UseControlsProps) => {
    const { crouchProne } = useCrouchProne();
    const { jump } = useJump();
    const { move } = useMove();
    const { shoot } = useShoot();

    const handleControls = React.useCallback(
        (controlProps: HandleControlsProps) => {
            crouchProne({
                capsule: props.capsule,
                gamepad: controlProps.gamepad,
                playerStateRef: props.playerStateRef,
            });

            jump({
                gamepad: controlProps.gamepad,
                playerOnFloor: props.playerOnFloor.current,
                playerStateRef: props.playerStateRef,
                playerVelocity: props.playerVelocity,
            });

            move({
                camera: controlProps.camera,
                delta: controlProps.delta,
                euler: props.euler,
                gamepad: controlProps.gamepad,
                playerDirection: props.playerDirection,
                playerOnFloor: props.playerOnFloor.current,
                playerStateRef: props.playerStateRef,
                playerVelocity: props.playerVelocity,
            });

            shoot({
                activeWeaponRef: props.activeWeaponRef,
                gamepad: controlProps.gamepad,
                playerStateRef: props.playerStateRef,
            });
        },
        [props, crouchProne, jump, move, shoot],
    );

    return { handleControls };
};
