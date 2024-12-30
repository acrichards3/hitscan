import type { PlayerState } from "@fps/lib";

/**
 * Calculate the player's walking speed based on their input (Effects stack)
 * @param playerRef - The player's state
 * @param leftX - The x-axis of the left joystick
 * @param leftY - The y-axis of the left joystick
 * @returns - The player's walking speed
 */
export const handleWalkingSpeed = (playerRef: PlayerState, leftX: number, leftY: number) => {
    let walkingSpeed = Math.sqrt(leftX ** 4 + leftY ** 4);

    // Cut movement speed in half when crouching
    if (playerRef.isCrouching) walkingSpeed /= 2;

    // Cut movement speed into a quarter when prone
    if (playerRef.isProne) walkingSpeed /= 4;

    // Cut movement speed in half when aiming
    if (playerRef.isAiming) walkingSpeed /= 2;

    // Stop player from moving if they ADS while prone
    if (playerRef.isProne && playerRef.isAiming) walkingSpeed = 0;

    return walkingSpeed;
};
