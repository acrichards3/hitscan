import nightSky from "./images/nightSky.jpg";
import { Stats, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Game } from "./Game";
import type React from "react";

export const World: React.FC = () => {
    return (
        <>
            <Canvas shadows={true}>
                <directionalLight
                    castShadow={true}
                    intensity={1.5}
                    position={[85.0, 80.0, 70.0]}
                    shadow-bias={-0.00015}
                    shadow-blur={10}
                    shadow-camera-bottom={-30}
                    shadow-camera-left={-30}
                    shadow-camera-right={30}
                    shadow-camera-top={30}
                    shadow-mapSize={[2048, 2048]}
                    shadow-radius={4}
                />
                <Environment background={true} files={nightSky} />
                <Game />
                <Stats />
            </Canvas>
            {/* Red dot in center of screen */}
            {/* <div
                style={{
                    backgroundColor: "red",
                    borderRadius: "50%",
                    height: "10px",
                    left: "50%",
                    position: "absolute",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "10px",
                }}
            ></div> */}
        </>
    );
};
