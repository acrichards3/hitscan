import React from "react";
import testMap from "./maps/testMap.glb";
import { Player } from "./player/Player";
import { useOctree } from "./hooks/useOctree";
import { useGLTF } from "@react-three/drei";
import { AK47 } from "./weapons/primary/AK47/AK47";
import { Quaternion, Vector3 } from "three";
import { Eve } from "./Eve";
import { channel } from "./utils/geckos";
import { WEAPONS } from "./weapons/weapon";
import { useFrame } from "@react-three/fiber";
import { Raycaster, Vector2, Mesh } from "three";
import type { Object3D } from "three";
import type { WeaponStats } from "./weapons/weapon";
import type { GameState, PlayerState } from "@fps/lib";

export const Game: React.FC = () => {
    const gltf = useGLTF(testMap);
    const { scene } = gltf; // Remember that you can add nodes back in here
    const octree = useOctree(scene); // Handles collision detection
    const raycaster = new Raycaster();
    const screenCenter = new Vector2(0, 0);

    const activeWeaponRef = React.useRef<WeaponStats>(WEAPONS.AK47);
    const [hitMarkers, setHitMarkers] = React.useState<Vector3[]>([]);

    // Ref prevents re-renders particularly in places where useFrame is used
    const playerStateRef = React.useRef<PlayerState>({
        direction: { w: 0, x: 0, y: 0, z: 0 },
        isAiming: false,
        isCrouching: false,
        isJumping: false,
        isProne: false,
        isShooting: false,
        isSprinting: false,
        isWalking: false,
        position: { x: 0, y: 0, z: 0 },
    });

    useFrame(({ camera }) => {
        // Handle raycasting when shooting
        if (playerStateRef.current.isShooting) {
            raycaster.setFromCamera(screenCenter, camera);

            const sceneObjects: Object3D[] = [];
            scene.traverse((obj) => {
                if (obj instanceof Mesh) {
                    sceneObjects.push(obj);
                }
            });
            const meshObjects = sceneObjects.filter((obj): obj is Mesh => obj instanceof Mesh);
            const intersects = raycaster.intersectObjects(meshObjects, true);

            if (intersects.length > 0) {
                const hitPoint = intersects.at(0)?.point;
                if (hitPoint) setHitMarkers((prevMarkers) => [...prevMarkers, hitPoint]);
            }
        }
    });

    return (
        <>
            <group
                dispose={null}
                position={[0, 0, 0]} // Adjust position if necessary
                rotation={[0, 0, 0]} // Rotate 180 degrees along the X-axis to flip
            >
                <primitive object={scene} />
            </group>
            <Players />
            <Player
                activeWeaponRef={activeWeaponRef}
                octree={octree}
                playerStateRef={playerStateRef}
            >
                <AK47 playerStateRef={playerStateRef} />
            </Player>
            {hitMarkers.map((marker, index) => (
                <mesh key={index} position={marker}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshBasicMaterial color="blue" />
                </mesh>
            ))}
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
