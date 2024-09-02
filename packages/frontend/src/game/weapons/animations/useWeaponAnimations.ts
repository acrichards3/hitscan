import React from "react";
import { applyADS } from "./apply/applyADS";
import { applyIdle } from "./apply/applyIdle";
import { applySprint } from "./apply/applySprint";
import { applyWalk } from "./apply/applyWalk";
import { Quaternion, Vector3, type Group, type Clock } from "three";
import type { Camera } from "@react-three/fiber";
import type { PlayerState } from "@fps/lib";

// TODO: Refactor if else nonsense

interface WeaponAnimationProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
    idleOffset: Vector3;
    idleRotation: Vector3;
    playerStateRef: React.MutableRefObject<PlayerState>;
}

export const useWeaponAnimations = (props: WeaponAnimationProps) => {
    const group = React.useRef<Group | null>(null);
    const playerRef = props.playerStateRef.current;

    const swayOffset = React.useMemo(() => new Vector3(0, 0, 0), []);
    const cameraQuaternion = React.useMemo(() => new Quaternion(), []);

    const handleWeaponAnimations = React.useCallback(
        ({ camera, clock }: { camera: Camera; clock: Clock }) => {
            if (!group.current) return;
            const [gamepad] = navigator.getGamepads();

            group.current.position.copy(camera.position);
            group.current.rotation.setFromQuaternion(camera.quaternion);
            camera.near = 0.01; // Prevents gun from clipping through camera
            camera.updateProjectionMatrix();

            if (gamepad) {
                const [leftX, leftY] = gamepad.axes;
                if (leftX == null || leftY == null) return;

                const playerIsWalking = Math.abs(leftX) > 0.1 || Math.abs(leftY) > 0.1;
                const isJumpButtonPressed = gamepad.buttons[0]?.pressed;
                const isCrouchButtonPressed = gamepad.buttons[1]?.pressed;
                let walkingSpeed = Math.sqrt(leftX ** 4 + leftY ** 4);

                // Cut movement speed in half when crouching
                if (playerRef.isCrouching) {
                    walkingSpeed /= 2;
                }

                // Cut movement speed in half when aiming (this stacks with crouching)
                if (playerRef.isAiming) {
                    walkingSpeed /= 2;
                }

                // Update isAiming based on gamepad input
                playerRef.isAiming = !!gamepad.buttons[6]?.pressed;

                // Set player to standing if crouch button is pressed while jumping
                if (isJumpButtonPressed && playerRef.isCrouching) {
                    playerRef.isCrouching = false;
                }

                // Cancel sprint if crouch button is pressed while sprinting
                if (isCrouchButtonPressed && playerRef.isSprinting) {
                    playerRef.isSprinting = false;
                }

                // Determine if player is sprinting
                if (leftY < -0.9 && gamepad.buttons[10]?.pressed && !playerRef.isSprinting) {
                    playerRef.isSprinting = true;
                    playerRef.isCrouching = false;
                }
                // Determine if player is no longer sprinting
                if (leftY > -0.9 && playerRef.isSprinting) {
                    playerRef.isSprinting = false;
                }

                if (playerRef.isAiming) {
                    applyADS({
                        adsOffset: props.adsOffset,
                        adsRotation: props.adsRotation,
                        camera,
                        cameraQuaternion,
                        clock,
                        group: group.current,
                        playerIsWalking,
                        swayOffset,
                        walkingSpeed,
                    });
                } else if (playerRef.isSprinting) {
                    applySprint({
                        group: group.current,
                        idleOffset: props.idleOffset,
                        idleRotation: props.idleRotation,
                    });
                } else if (playerIsWalking) {
                    applyWalk({
                        clock,
                        group: group.current,
                        idleOffset: props.idleOffset,
                        idleRotation: props.idleRotation,
                        walkingSpeed,
                    });
                } else {
                    applyIdle({
                        group: group.current,
                        idleOffset: props.idleOffset,
                        idleRotation: props.idleRotation,
                    });
                }
            } else {
                applyIdle({
                    group: group.current,
                    idleOffset: props.idleOffset,
                    idleRotation: props.idleRotation,
                });
            }
        },
        [
            playerRef,
            props.adsOffset,
            props.adsRotation,
            props.idleOffset,
            props.idleRotation,
            swayOffset,
            cameraQuaternion,
        ],
    );

    return { group, handleWeaponAnimations };
};
