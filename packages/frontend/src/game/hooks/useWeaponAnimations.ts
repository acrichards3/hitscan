import React from "react";
import { Vector3, Quaternion, Group } from "three";

interface WeaponAnimationProps {
    adsOffset: Vector3;
    adsRotation: Vector3;
}

export const useWeaponAnimations = () => {
    const group = React.useRef<Group | null>(null);
    const prevCrouchPressed = React.useRef(false);
};
