import EveMesh from "./eve.glb";
import { useGLTF } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import type { Quaternion } from "three";
import type React from "react";

interface EveProps {
    direction: Quaternion;
    position: Vector3;
}

export const Eve: React.FC<EveProps> = (props) => {
    const { nodes, materials } = useGLTF(EveMesh);

    const rotation = new Euler();
    // rotation.setFromQuaternion(props.direction);
    rotation.x += Math.PI / 2;

    const test = new Euler();
    test.setFromQuaternion(props.direction);

    const position = new Vector3(props.position.x, props.position.y - 1.5, props.position.z);

    return (
        <group dispose={null}>
            <group name="Scene">
                <group name="Armature" position={position} rotation={rotation} scale={0.012}>
                    <primitive object={nodes.mixamorigHips as object} />
                    <skinnedMesh
                        castShadow={true}
                        frustumCulled={false}
                        geometry={nodes.Mesh.geometry}
                        material={materials.SpacePirate_M}
                        name="Mesh"
                        skeleton={nodes.Mesh.skeleton}
                    />
                </group>
            </group>
        </group>
    );
};
