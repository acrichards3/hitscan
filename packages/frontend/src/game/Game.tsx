import React from "react";
import testMap from "./maps/testMap.glb";
import { Player } from "./player/Player";
import { useOctree } from "./hooks/useOctree";
import { useGLTF } from "@react-three/drei";
import { AR } from "./weapons/AR/AR";
import { Mesh, Object3D, Quaternion, Vector3 } from "three";
import { Eve } from "./Eve";
import { channel } from "./utils/geckos";
import { GameState } from "@fps/lib";

export const Game: React.FC = () => {
    const gltf = useGLTF(testMap);
    const { nodes, scene } = gltf;

    const octree = useOctree(scene);
    const mapMesh = nodes["Suzanne007"];

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
            <Player octree={octree}>
                <AR />
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
