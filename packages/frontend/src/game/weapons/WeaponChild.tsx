import React from "react";
import { useWeaponAnimations } from "../hooks/useWeaponAnimations";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh, Object3D, Vector3 } from "three";
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
    const { group, handleWeaponAnimations } = useWeaponAnimations(props);

    // Handles updates for weapon animations
    useFrame(({ camera, clock }) => {
        handleWeaponAnimations({ camera, clock });
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
