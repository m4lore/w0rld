import * as THREE from 'three';

// three's fog uses depth along the view, which leaves the sides of the screen clearer than the middle
const DEPTH_FOG_LINE = 'vFogDepth = - mvPosition.z;';
const DISTANCE_FOG_LINE = 'vFogDepth = length(mvPosition.xyz);';

export function enableDistanceFog() {
  const fogVertex = THREE.ShaderChunk.fog_vertex;
  if (!fogVertex.includes(DEPTH_FOG_LINE)) {
    throw new Error(
      'no depth line in fog_vertex to swap: three changed it, or enableDistanceFog already ran',
    );
  }
  // chunks get pasted in when a shader compiles, so call this before anything compiles
  THREE.ShaderChunk.fog_vertex = fogVertex.replace(
    DEPTH_FOG_LINE,
    DISTANCE_FOG_LINE,
  );
}
