import React from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh, Object3D, Vector3, Group, Quaternion } from "three";
import { adsWalk } from "../camera/cameraAnimations";
import { idle, sprint, walk } from "./weaponAnimations";
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

    const swayOffset = React.useMemo(() => new Vector3(0, 0, 0), []);
    const cameraQuaternion = React.useMemo(() => new Quaternion(), []);

    useFrame(({ camera, clock }) => {
        if (!group.current) return;

        // const time = clock.getElapsedTime();
        // const { swayX, swayY } = adsWalk({
        //     amplitude: 0.12,
        //     frequency: 6.5, // TODO: Tie this to player movement speed
        //     time,
        // });

        // // Camera Sway / Shake
        // swayOffset.set(swayX, swayY, 0);
        // camera.getWorldQuaternion(cameraQuaternion);
        // swayOffset.applyQuaternion(cameraQuaternion);
        // camera.position.add(swayOffset);

        // Default Camera Position
        group.current.position.copy(camera.position);
        group.current.rotation.setFromQuaternion(camera.quaternion);
        camera.near = 0.01; // Prevents gun from clipping through camera
        camera.updateProjectionMatrix();

        // ADS Position
        // group.current.rotateX(props.adsRotation.x);
        // group.current.rotateY(props.adsRotation.y);
        // group.current.rotateZ(props.adsRotation.z);
        // group.current.translateX(props.adsOffset.x);
        // group.current.translateY(props.adsOffset.y);
        // group.current.translateZ(props.adsOffset.z);

        // Idle Position
        group.current.rotateX(props.idleRotation.x);
        group.current.rotateY(props.idleRotation.y);
        group.current.rotateZ(props.idleRotation.z);
        group.current.translateX(props.idleOffset.x + idle().x);
        group.current.translateY(props.idleOffset.y + idle().y);
        group.current.translateZ(props.idleOffset.z);

        // Walking Position
        // group.current.rotateX(props.idleRotation.x);
        // group.current.rotateY(props.idleRotation.y);
        // group.current.rotateZ(props.idleRotation.z);
        // group.current.translateX(props.idleOffset.x + walk().x);
        // group.current.translateY(props.idleOffset.y + walk().y);
        // group.current.translateZ(props.idleOffset.z);

        // Sprinting Position
        // group.current.rotateX(props.idleRotation.x + sprint().rotate.x);
        // group.current.rotateY(props.idleRotation.y + sprint().rotate.y);
        // group.current.rotateZ(props.idleRotation.z + sprint().rotate.z);
        // group.current.translateX(props.idleOffset.x + sprint().translate.x);
        // group.current.translateY(props.idleOffset.y + sprint().translate.y);
        // group.current.translateZ(props.idleOffset.z + sprint().translate.z);
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
