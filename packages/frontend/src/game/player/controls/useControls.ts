import React from "react";
import { useJump } from "./useJump";
import { useMove } from "./useMove";
import type { Camera } from "@react-three/fiber";
import type { Euler, Vector3 } from "three";
import type { PlayerState } from "@fps/lib";

interface UseControlsProps {
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
    const { jump } = useJump();
    const { move } = useMove();

    const handleControls = React.useCallback(
        (controlProps: HandleControlsProps) => {
            jump({
                gamepad: controlProps.gamepad,
                playerOnFloor: props.playerOnFloor.current,
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
        },
        [props, jump, move],
    );

    return { handleControls };
};
