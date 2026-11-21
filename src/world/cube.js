import * as THREE from 'three';

const CUBE_SIZE = 2;
const CUBE_COLOR = 0x8b5cf6;

// placeholder until the planet
export class Cube {
  constructor() {
    const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material = new THREE.MeshStandardMaterial({ color: CUBE_COLOR });
    this.root = new THREE.Mesh(geometry, material);
  }
}
