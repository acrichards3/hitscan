interface CameraSwayProps {
    amplitude: number;
    frequency: number;
    time: number;
}

export const adsWalk = (props: CameraSwayProps): { swayX: number; swayY: number } => {
    const swayX = Math.sin(props.time * props.frequency) * props.amplitude;
    const swayY = Math.abs(Math.sin(props.time * props.frequency)) * props.amplitude;
    return { swayX, swayY };
};
