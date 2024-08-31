import React from "react";
import { sprint, walk, idle } from "../weapons/functions/weaponAnimations";
import { Vector3, Quaternion, Group, Clock } from "three";
import { Camera } from "@react-three/fiber";

interface WeaponAnimationProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
    idleOffset: Vector3;
    idleRotation: Vector3;
}

export const useWeaponAnimations = (props: WeaponAnimationProps) => {
    const group = React.useRef<Group | null>(null);
    const prevCrouchPressed = React.useRef(false);

    const swayOffset = React.useMemo(() => new Vector3(0, 0, 0), []);
    const cameraQuaternion = React.useMemo(() => new Quaternion(), []);

    const [playerIsCrouching, setPlayerIsCrouching] = React.useState(false);
    const [playerIsSprinting, setPlayerIsSprinting] = React.useState(false);

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

                const playerIsAiming = gamepad.buttons[6]?.pressed;
                const playerIsWalking = Math.abs(leftX) > 0.1 || Math.abs(leftY) > 0.1;
                const isCrouchPressed = gamepad.buttons[1]?.pressed;
                const isJumpPressed = gamepad.buttons[0]?.pressed;
                const walkingSpeed = Math.sqrt(leftX ** 4 + leftY ** 4);

                // Determine if player is crouching
                if (isCrouchPressed && !prevCrouchPressed.current) {
                    setPlayerIsCrouching(!playerIsCrouching);
                }
                if (isJumpPressed && playerIsCrouching) {
                    setPlayerIsCrouching(false);
                }
                prevCrouchPressed.current = !!isCrouchPressed;

                // Determine if player is sprinting
                if (leftY < -0.9 && gamepad.buttons[10]?.pressed && !playerIsSprinting) {
                    setPlayerIsSprinting(true);
                    setPlayerIsCrouching(false);
                }
                if (leftY > -0.9 && playerIsSprinting) {
                    setPlayerIsSprinting(false);
                }

                if (playerIsAiming) {
                    applyADSAnimation(
                        group.current,
                        props.adsOffset,
                        props.adsRotation,
                        playerIsWalking,
                        walkingSpeed,
                        clock,
                        camera,
                        swayOffset,
                        cameraQuaternion,
                    );
                } else if (playerIsSprinting) {
                    applySprintAnimation(group.current, props.idleOffset, props.idleRotation);
                } else if (playerIsWalking) {
                    applyWalkingAnimation(
                        group.current,
                        props.idleOffset,
                        props.idleRotation,
                        walkingSpeed,
                        clock,
                    );
                } else {
                    applyIdleAnimation(group.current, props.idleOffset, props.idleRotation);
                }
            } else {
                applyIdleAnimation(group.current, props.idleOffset, props.idleRotation);
            }
        },
        [
            playerIsCrouching,
            playerIsSprinting,
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

// Applying animations

const applySprintAnimation = (group: Group, idleOffset: Vector3, idleRotation: Vector3) => {
    group.rotateX(idleRotation.x + sprint().rotate.x);
    group.rotateY(idleRotation.y + sprint().rotate.y);
    group.rotateZ(idleRotation.z + sprint().rotate.z);
    group.translateX(idleOffset.x + sprint().translate.x);
    group.translateY(idleOffset.y + sprint().translate.y);
    group.translateZ(idleOffset.z + sprint().translate.z);
};

const applyWalkingAnimation = (
    group: Group,
    idleOffset: Vector3,
    idleRotation: Vector3,
    walkingSpeed: number,
    clock: Clock,
) => {
    const walkingAmplitude = 0.01;
    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(idleOffset.x + walk(walkingAmplitude, clock, walkingSpeed).x);
    group.translateY(idleOffset.y + walk(walkingAmplitude, clock, walkingSpeed).y);
    group.translateZ(idleOffset.z);
};

const applyIdleAnimation = (group: Group, idleOffset: Vector3, idleRotation: Vector3) => {
    group.rotateX(idleRotation.x);
    group.rotateY(idleRotation.y);
    group.rotateZ(idleRotation.z);
    group.translateX(idleOffset.x + idle().x);
    group.translateY(idleOffset.y + idle().y);
    group.translateZ(idleOffset.z);
};

const applyADSAnimation = (
    group: Group,
    adsOffset: Vector3,
    adsRotation: Vector3,
    playerIsWalking: boolean,
    walkingSpeed: number,
    clock: Clock,
    camera: Camera,
    swayOffset: Vector3,
    cameraQuaternion: Quaternion,
) => {
    // Apply ADS rotation and translation
    group.rotateX(adsRotation.x);
    group.rotateY(adsRotation.y);
    group.rotateZ(adsRotation.z);
    group.translateX(adsOffset.x);
    group.translateY(adsOffset.y);
    group.translateZ(adsOffset.z);

    // If the player is walking while aiming, apply a sway effect
    if (playerIsWalking) {
        const adsWalkingAmplitude = 0.003; // Adjust the amplitude to control sway intensity
        const { x, y } = walk(adsWalkingAmplitude, clock, walkingSpeed); // Get sway offset based on walking speed
        swayOffset.set(x, y, 0); // Set sway offset
        camera.getWorldQuaternion(cameraQuaternion); // Get camera's world quaternion
        swayOffset.applyQuaternion(cameraQuaternion); // Apply the camera's rotation to the sway offset
        camera.position.add(swayOffset); // Apply sway offset to the camera position
    }
};
