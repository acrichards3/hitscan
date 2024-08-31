import React from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh, Object3D, Vector3, Group, Quaternion } from "three";
import { idle, sprint, walk } from "./functions/weaponAnimations";
import type { WeaponStats } from "./weapon";

interface WeaponChildProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
    idleOffset: Vector3;
    idleRotation: Vector3;
    meshPath: string;
    scale: number;
    stats: WeaponStats;
}

export const WeaponChild: React.FC<WeaponChildProps> = (props) => {
    const { nodes } = useGLTF(props.meshPath);

    const group = React.useRef<Group | null>(null);
    const prevCrouchPressed = React.useRef(false);

    const swayOffset = React.useMemo(() => new Vector3(0, 0, 0), []);
    const cameraQuaternion = React.useMemo(() => new Quaternion(), []);

    const [playerIsCrouching, setPlayerIsCrouching] = React.useState(false);
    const [playerIsProne, setPlayerIsProne] = React.useState(false);
    const [playerIsSprinting, setPlayerIsSprinting] = React.useState(false);

    // Handles updates for weapon animations
    useFrame(({ camera, clock }) => {
        if (!group.current) return;
        const [gamepad] = navigator.getGamepads();

        // Default Camera Position
        group.current.position.copy(camera.position);
        group.current.rotation.setFromQuaternion(camera.quaternion);
        camera.near = 0.01; // Prevents gun from clipping through camera
        camera.updateProjectionMatrix();

        // Weapon Animations
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
                // ADS Position
                group.current.rotateX(props.adsRotation.x);
                group.current.rotateY(props.adsRotation.y);
                group.current.rotateZ(props.adsRotation.z);
                group.current.translateX(props.adsOffset.x);
                group.current.translateY(props.adsOffset.y);
                group.current.translateZ(props.adsOffset.z);

                if (playerIsWalking) {
                    const adsWalkingAmplitude = 0.003;
                    const { x, y } = walk(adsWalkingAmplitude, clock, walkingSpeed);
                    // Camera Sway / Shake (ads walking)
                    swayOffset.set(x, y, 0);
                    camera.getWorldQuaternion(cameraQuaternion);
                    swayOffset.applyQuaternion(cameraQuaternion);
                    camera.position.add(swayOffset);
                }
            } else if (playerIsSprinting) {
                // Sprinting Position
                group.current.rotateX(props.idleRotation.x + sprint().rotate.x);
                group.current.rotateY(props.idleRotation.y + sprint().rotate.y);
                group.current.rotateZ(props.idleRotation.z + sprint().rotate.z);
                group.current.translateX(props.idleOffset.x + sprint().translate.x);
                group.current.translateY(props.idleOffset.y + sprint().translate.y);
                group.current.translateZ(props.idleOffset.z + sprint().translate.z);
            } else if (playerIsWalking) {
                // Walking Position
                const walkingAmplitude = 0.01;
                group.current.rotateX(props.idleRotation.x);
                group.current.rotateY(props.idleRotation.y);
                group.current.rotateZ(props.idleRotation.z);
                group.current.translateX(props.idleOffset.x + walk(walkingAmplitude, clock, walkingSpeed).x); // prettier-ignore
                group.current.translateY(props.idleOffset.y + walk(walkingAmplitude, clock, walkingSpeed).y); // prettier-ignore
                group.current.translateZ(props.idleOffset.z);
            } else {
                // Idle Position
                group.current.rotateX(props.idleRotation.x);
                group.current.rotateY(props.idleRotation.y);
                group.current.rotateZ(props.idleRotation.z);
                group.current.translateX(props.idleOffset.x + idle().x);
                group.current.translateY(props.idleOffset.y + idle().y);
                group.current.translateZ(props.idleOffset.z);
            }
        } else {
            // Idle Position
            group.current.rotateX(props.idleRotation.x);
            group.current.rotateY(props.idleRotation.y);
            group.current.rotateZ(props.idleRotation.z);
            group.current.translateX(props.idleOffset.x + idle().x);
            group.current.translateY(props.idleOffset.y + idle().y);
            group.current.translateZ(props.idleOffset.z);
        }
    });

    return (
        <group dispose={null} ref={group}>
            {Object.values(nodes).map((node) => {
                if (isMesh(node)) {
                    return (
                        <mesh
                            geometry={node.geometry}
                            key={node.uuid}
                            material={node.material}
                            position={node.position}
                            scale={props.scale}
                        />
                    );
                }
            })}
        </group>
    );
};

const isMesh = (obj: Object3D | undefined | null): obj is Mesh => obj instanceof Mesh;
