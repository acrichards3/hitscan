import React from "react";
import { useWeaponAnimations } from "./animations/hooks/useWeaponAnimations";
import { useWeaponSounds } from "./sounds/useWeaponSounds";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3, Quaternion } from "three";
import type { Object3D, Group } from "three";
import type { WeaponStats } from "./weapon";
import type { PlayerState } from "@fps/lib";

interface WeaponChildProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
    idleOffset: Vector3;
    idleRotation: Vector3;
    meshPath: string;
    playerStateRef: React.MutableRefObject<PlayerState>;
    scale: number;
    shootBufferUrl: string;
    stats: WeaponStats;
}

export const WeaponChild: React.FC<WeaponChildProps> = (props) => {
    const audioContextRef = React.useRef(new AudioContext());
    const group = React.useRef<Group | null>(null);
    const swayOffestRef = React.useRef(new Vector3(0, 0, 0));
    const cameraQuaternionRef = React.useRef(new Quaternion());
    const { nodes } = useGLTF(props.meshPath);

    // Handles updates for weapon animations
    useWeaponAnimations({
        ...props,
        cameraQuaternionRef,
        group,
        swayOffestRef,
    });

    // TODO: Fix this trash
    const { playShootSound } = useWeaponSounds({
        audioContext: audioContextRef.current,
        playerStateRef: props.playerStateRef,
        shootBufferUrl: props.shootBufferUrl,
        stats: props.stats,
    });

    useFrame(() => {
        if (audioContextRef.current.state === "suspended") void audioContextRef.current.resume(); // User has to interact with the page to enable audio
        playShootSound();
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
