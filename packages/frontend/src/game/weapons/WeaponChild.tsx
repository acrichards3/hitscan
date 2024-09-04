import React from "react";
import { useWeaponAnimations } from "./animations/useWeaponAnimations";
import { useWeaponSounds } from "./sounds/useWeaponSounds";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import type { Object3D, Vector3 } from "three";
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
    const { nodes } = useGLTF(props.meshPath);
    const { group, handleWeaponAnimations } = useWeaponAnimations(props);
    const { playShootSound } = useWeaponSounds({
        audioContext: audioContextRef.current,
        playerStateRef: props.playerStateRef,
        shootBufferUrl: props.shootBufferUrl,
        stats: props.stats,
    });

    // Handles updates for weapon animations
    useFrame(({ camera, clock }) => {
        // TODO: Figure out way to make sound available instantly
        if (audioContextRef.current.state === "suspended") void audioContextRef.current.resume(); // User has to interact with the page to enable audio
        handleWeaponAnimations({ camera, clock });
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
