import { Vector3 } from "three";
import "three/examples/jsm/math/Octree.js";

declare module "three/examples/jsm/math/Octree.js" {
    interface CapsuleIntersectResult {
        depth: number;
        normal: Vector3 | undefined;
    }
    export interface Octree {
        capsuleIntersect(capsule: Capsule): CapsuleIntersectResult;
    }
}
