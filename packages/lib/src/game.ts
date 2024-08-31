export interface GameState {
    players: Record<string, PlayerState>;
}

export interface PlayerState {
    direction: Quaternion;
    position: Vector3;
    isWalking: boolean;
    isSprinting: boolean;
    isCrouching: boolean;
    isJumping: boolean;
    isAiming: boolean;
    isShooting: boolean;
}

export interface Quaternion extends Vector3 {
    w: number;
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}
