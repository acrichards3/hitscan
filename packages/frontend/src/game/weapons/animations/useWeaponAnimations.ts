import React from "react";
import { applyADS } from "./apply/applyADS";
import { applyIdle } from "./apply/applyIdle";
import { applyShoot } from "./apply/applyShoot";
import { applySprint } from "./apply/applySprint";
import { applyWalk } from "./apply/applyWalk";
import type { Quaternion, Vector3, Group, Clock } from "three";
import type { Camera } from "@react-three/fiber";
import type { PlayerState } from "@fps/lib";
import type { WeaponStats } from "../weapon";

// TODO: Refactor if else nonsense

interface WeaponAnimationProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
    cameraQuaternionRef: React.MutableRefObject<Quaternion>;
    group: React.MutableRefObject<Group | null>;
    idleOffset: Vector3;
    idleRotation: Vector3;
    playerStateRef: React.MutableRefObject<PlayerState>;
    stats: WeaponStats;
    swayOffestRef: React.MutableRefObject<Vector3>;
}

export const useWeaponAnimations = (props: WeaponAnimationProps) => {
    const handleWeaponAnimations = ({ camera, clock }: { camera: Camera; clock: Clock }) => {
        if (!props.group.current) return;
        const [gamepad] = navigator.getGamepads();
        const playerRef = props.playerStateRef.current;
        const swayOffset = props.swayOffestRef.current;
        const cameraQuaternion = props.cameraQuaternionRef.current;

        props.group.current.position.copy(camera.position);
        props.group.current.rotation.setFromQuaternion(camera.quaternion);
        camera.near = 0.01; // Prevents gun from clipping through camera
        camera.updateProjectionMatrix();

        if (gamepad) {
            const [leftX, leftY] = gamepad.axes;
            if (leftX == null || leftY == null) return;

            const playerIsWalking = Math.abs(leftX) > 0.1 || Math.abs(leftY) > 0.1;
            const isJumpButtonPressed = gamepad.buttons[0]?.pressed;
            const isCrouchButtonPressed = gamepad.buttons[1]?.pressed;
            let walkingSpeed = Math.sqrt(leftX ** 4 + leftY ** 4);

            // !Player actions / state
            // Cut movement speed in half when crouching
            if (playerRef.isCrouching) {
                walkingSpeed /= 2;
            }

            // Cut movement speed into a quarter when prone
            if (playerRef.isProne) {
                walkingSpeed /= 4;
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

            // !Animations
            if (playerRef.isShooting) {
                applyShoot({
                    camera,
                    clock,
                    group: props.group.current,
                    idleOffset: props.idleOffset,
                    idleRotation: props.idleRotation,
                    playerStateRef: props.playerStateRef,
                    stats: props.stats,
                });
            }

            if (playerRef.isAiming) {
                applyADS({
                    adsOffset: props.adsOffset,
                    adsRotation: props.adsRotation,
                    camera,
                    cameraQuaternion,
                    clock,
                    group: props.group.current,
                    playerIsWalking,
                    swayOffset,
                    walkingSpeed,
                });
            } else if (playerRef.isSprinting) {
                applySprint({
                    group: props.group.current,
                    idleOffset: props.idleOffset,
                    idleRotation: props.idleRotation,
                });
            } else if (playerIsWalking) {
                applyWalk({
                    clock,
                    group: props.group.current,
                    idleOffset: props.idleOffset,
                    idleRotation: props.idleRotation,
                    walkingSpeed,
                });
            } else {
                applyIdle({
                    group: props.group.current,
                    idleOffset: props.idleOffset,
                    idleRotation: props.idleRotation,
                });
            }
        } else {
            applyIdle({
                group: props.group.current,
                idleOffset: props.idleOffset,
                idleRotation: props.idleRotation,
            });
        }
    };

    return { handleWeaponAnimations };
};
