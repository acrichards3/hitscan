import React from "react";
import testMap from "./maps/testMap.glb";
import { Player } from "./player/Player";
import { useOctree } from "./hooks/useOctree";
import { useGLTF } from "@react-three/drei";
import { AK47 } from "./weapons/primary/AK47/AK47";
import { Mesh, Quaternion, Vector3 } from "three";
import { Eve } from "./Eve";
import { channel } from "./utils/geckos";
import { WEAPONS } from "./weapons/weapon";
import type { WeaponStats } from "./weapons/weapon";
import type { GameState, PlayerState } from "@fps/lib";
import type { Object3D } from "three";

export const Game: React.FC = () => {
    const gltf = useGLTF(testMap);
    const { nodes, scene } = gltf;
    const octree = useOctree(scene); // Handles collision detection
    const mapMesh = nodes["Suzanne007"];

    const activeWeaponRef = React.useRef<WeaponStats>(WEAPONS.AK47);

    // Ref prevents re-renders particularly in places where useFrame is used
    const playerStateRef = React.useRef<PlayerState>({
        direction: { w: 0, x: 0, y: 0, z: 0 },
        isAiming: false,
        isCrouching: false,
        isJumping: false,
        isShooting: false,
        isSprinting: false,
        isWalking: false,
        position: { x: 0, y: 0, z: 0 },
    });

    if (!isMesh(mapMesh)) return null;

    return (
        <>
            <group dispose={null}>
                <mesh
                    castShadow={true}
                    geometry={mapMesh.geometry}
                    material={mapMesh.material}
                    position={[1.74, 1.04, 24.97]}
                    receiveShadow={true}
                />
            </group>
            <Players />
            <Player
                activeWeaponRef={activeWeaponRef}
                octree={octree}
                playerStateRef={playerStateRef}
            >
                <AK47 playerStateRef={playerStateRef} />
            </Player>
        </>
    );
};

const Players = () => {
    const [gameState, setGameState] = React.useState<GameState>();
    React.useEffect(() => {
        channel.on("server-tick", (state) => {
            setGameState(state as GameState);
        });
    }, []);
    if (gameState == null) {
        return null;
    }
    return Object.entries(gameState.players)
        .filter(([id]) => id !== channel.id)
        .map(([id, { direction, position }]) => (
            <Eve
                direction={new Quaternion(direction.x, direction.y, direction.z, direction.w)}
                key={id}
                position={new Vector3(position.x, position.y, position.z)}
            />
        ));
};

const isMesh = (obj: Object3D | undefined | null): obj is Mesh => obj instanceof Mesh;
