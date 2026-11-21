import * as THREE from 'three';

const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;

export function createCamera() {
  // real aspect gets set in resizeToWindow
  return new THREE.PerspectiveCamera(CAMERA_FOV, 1, CAMERA_NEAR, CAMERA_FAR);
}
