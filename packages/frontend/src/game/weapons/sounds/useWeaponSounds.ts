import React from "react";
import type { WeaponStats } from "../weapon";
import type { MutableRefObject } from "react";
import type { PlayerState } from "@fps/lib";

interface UseWeaponSoundsProps {
    audioContext: AudioContext | null; // Pass AudioContext as a prop
    playerStateRef: MutableRefObject<PlayerState>;
    shootBufferUrl: string; // URL to the shoot sound file
    stats: WeaponStats;
}

export const useWeaponSounds = ({
    playerStateRef,
    shootBufferUrl,
    stats,
    audioContext,
}: UseWeaponSoundsProps) => {
    const lastShotTimeRef = React.useRef<number>(0);
    const fireRateMs = stats.fireRateMs;

    const shootBufferRef = React.useRef<AudioBuffer | null>(null);

    // Load the shootBuffer when the hook is initialized
    React.useEffect(() => {
        const loadShootBuffer = async () => {
            try {
                const response = await fetch(shootBufferUrl);
                const arrayBuffer = await response.arrayBuffer();
                if (audioContext) {
                    const buffer = await audioContext.decodeAudioData(arrayBuffer);
                    shootBufferRef.current = buffer;
                }
            } catch (error) {
                console.error("Failed to load shoot sound buffer:", error);
            }
        };

        void loadShootBuffer();
    }, [shootBufferUrl, audioContext]);

    const playShootSound = () => {
        if (audioContext) {
            const isShooting = playerStateRef.current.isShooting;
            const currentTime = audioContext.currentTime;

            const timeSinceLastShot = (currentTime - lastShotTimeRef.current) * 1000; // Convert to milliseconds

            if (isShooting && timeSinceLastShot >= fireRateMs && shootBufferRef.current) {
                // Calculate the exact time to start the sound
                const nextShotTime = lastShotTimeRef.current + fireRateMs / 1000; // Convert fireRateMs to seconds

                // Schedule the sound to start at the precise time
                const source = audioContext.createBufferSource();
                source.buffer = shootBufferRef.current;
                source.connect(audioContext.destination);

                // Start the sound at the calculated time
                source.start(nextShotTime);

                // Cleanup: disconnect the source when done to free up resources
                source.onended = () => {
                    source.disconnect();
                };

                // Update the last shot time to the scheduled shot time
                lastShotTimeRef.current = nextShotTime;
            }
        }
    };

    return { playShootSound };
};
