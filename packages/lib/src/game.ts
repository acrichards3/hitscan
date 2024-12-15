import type { Quaternion, Vector3 } from "three";

export interface GameState {
    players: Record<string, PlayerState>;
}

export interface PlayerState {
    direction: Quaternion;
    isAiming: boolean;
    isCrouching: boolean;
    isJumping: boolean;
    isProne: boolean;
    isShooting: boolean;
    isSprinting: boolean;
    isWalking: boolean;
    position: Vector3;
}
