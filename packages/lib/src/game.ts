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

export interface Quaternion extends Vector3 {
    w: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
