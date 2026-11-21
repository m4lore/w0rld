import * as THREE from 'three';

/** @param {HTMLElement} container */
export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  container.appendChild(renderer.domElement);
  return renderer;
}
