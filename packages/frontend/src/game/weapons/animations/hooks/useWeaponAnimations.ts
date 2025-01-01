import React from "react";
import { ads } from "../ads";
import { crawl } from "../crawl";
import { idle } from "../idle";
import { handleWalkingSpeed } from "../functions/handleWalkingSpeed";
import { sprint } from "../sprint";
import { walk } from "../walk";
import { useFrame } from "@react-three/fiber";
import type { Quaternion, Vector3, Group } from "three";
import type { PlayerState } from "@fps/lib";
import type { WeaponStats } from "../../weapon";

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
    const crouchOffset = { x: -0.03, y: -0.01 } as const;
    const currentOffset = React.useRef({ x: props.idleOffset.x, y: props.idleOffset.y });

    useFrame(({ camera, clock }) => {
        if (!props.group.current) return;

        const [gamepad] = navigator.getGamepads();
        const playerRef = props.playerStateRef.current;
        const swayOffset = props.swayOffestRef.current;
        const cameraQuaternion = props.cameraQuaternionRef.current;

        props.group.current.position.set(camera.position.x, camera.position.y, camera.position.z);
        props.group.current.rotation.setFromQuaternion(camera.quaternion);

        // Prevents gun from clipping through camera
        if (camera.near !== 0.01) {
            camera.near = 0.01;
            camera.updateProjectionMatrix();
        }

        // Default to idle if no gamepad is connected
        if (gamepad == null) {
            idle({
                clock,
                crouchOffset,
                currentOffset: currentOffset.current,
                group: props.group.current,
                idleOffset: props.idleOffset,
                idleRotation: props.idleRotation,
                playerState: playerRef,
            });
            return;
        }

        const [leftX, leftY] = gamepad.axes;
        if (leftX == undefined || leftY == undefined) return;

        const walkingSpeed = handleWalkingSpeed(playerRef, leftX, leftY);
        const playerIsWalking = Math.abs(leftX) > 0.1 || Math.abs(leftY) > 0.1;
        const isJumpButtonPressed = gamepad.buttons[0]?.pressed;
        const isCrouchButtonPressed = gamepad.buttons[1]?.pressed;

        playerRef.isAiming = !!gamepad.buttons[6]?.pressed;

        if (isJumpButtonPressed && playerRef.isCrouching) playerRef.isCrouching = false;
        if (isCrouchButtonPressed && playerRef.isSprinting) playerRef.isSprinting = false;
        if (gamepad.buttons[7]?.pressed && playerRef.isSprinting) playerRef.isSprinting = false;
        if (isJumpButtonPressed && playerRef.isCrouching) playerRef.isCrouching = false;

        if (leftY < -0.9 && gamepad.buttons[10]?.pressed && !playerRef.isSprinting) {
            playerRef.isSprinting = true;
            playerRef.isCrouching = false;
        }

        if (leftY > -0.9 && playerRef.isSprinting) playerRef.isSprinting = false;

        // * note: Order of animations matters as some animations trump others
        if (playerRef.isAiming) {
            ads({
                adsOffset: props.adsOffset,
                adsRotation: props.adsRotation,
                camera,
                cameraQuaternion,
                clock,
                group: props.group.current,
                playerIsCrouching: playerRef.isCrouching,
                playerIsWalking,
                swayOffset,
                walkingSpeed,
            });
            return;
        }

        if (playerRef.isSprinting) {
            sprint({
                clock,
                group: props.group.current,
                idleOffset: props.idleOffset,
                idleRotation: props.idleRotation,
            });
            return;
        }

        if (playerRef.isProne && playerIsWalking) {
            crawl({
                clock,
                group: props.group.current,
                idleOffset: props.idleOffset,
                idleRotation: props.idleRotation,
                walkingSpeed,
            });
            return;
        }

        if (playerIsWalking) {
            walk({
                clock,
                crouchOffset,
                currentOffset: currentOffset.current,
                group: props.group.current,
                idleOffset: props.idleOffset,
                idleRotation: props.idleRotation,
                playerState: playerRef,
                walkingSpeed,
            });
            return;
        }

        // Default to idle animation if no other input
        idle({
            clock,
            crouchOffset,
            currentOffset: currentOffset.current,
            group: props.group.current,
            idleOffset: props.idleOffset,
            idleRotation: props.idleRotation,
            playerState: playerRef,
        });
    });
};
