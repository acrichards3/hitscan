export const idle = (): { x: number; y: number } => {
    const amplitude = 0.005;
    const frequency = 1.3;
    const time = Date.now() / 1000;

    const x = amplitude * Math.sin(frequency * time); // Horizontal movement
    const y = amplitude * Math.sin(2 * frequency * time) * Math.cos(frequency * time); // Vertical movement combining sine and cosine for figure-eight

    return { x, y };
};
