import React from "react";
import { Object3D } from "three";
import { Octree } from "three/examples/jsm/math/Octree.js";

export const useOctree = (scene: Object3D) => {
    return React.useMemo(() => new Octree().fromGraphNode(scene), [scene]);
};
