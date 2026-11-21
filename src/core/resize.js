import * as THREE from 'three';

// over 2 it's just heavier, you can't see the difference
const MAX_PIXEL_RATIO = 2;

/**
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.PerspectiveCamera} camera
 */
export function resizeToWindow(renderer, camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  // changing aspect does nothing until you call this
  camera.updateProjectionMatrix();

  // zoom changes devicePixelRatio, so not just once at startup
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.setSize(width, height);
}
