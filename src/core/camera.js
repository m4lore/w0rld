import * as THREE from 'three';

const CAMERA_FOV = 75;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;

const CAMERA_Z = 40;

export function createCamera() {
  // real aspect gets set in resizeToWindow
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    1,
    CAMERA_NEAR,
    CAMERA_FAR,
  );
  camera.position.set(0, 0, CAMERA_Z);
  // aims from the current position, so it has to come after set
  camera.lookAt(0, 0, 0);
  return camera;
}
