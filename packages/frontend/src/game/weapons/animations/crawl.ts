import { Vector3 } from "three";
import type { Clock, Group } from "three";

interface CrawlProps {
    clock: Clock;
    group: Group;
    idleOffset: Vector3;
    idleRotation: Vector3;
    walkingSpeed: number;
}

export const crawl = (props: CrawlProps) => {
    const { clock, group, idleOffset, idleRotation, walkingSpeed } = props;
};

const crawlCoordinates = () => {};
