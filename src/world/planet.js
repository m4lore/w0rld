import * as THREE from 'three';

// placeholders, the real ones get picked later
const PLANET_RADIUS = 20;
const PLANET_COLOR = 0xdddddd;

const WIDTH_SEGMENTS = 64;
const HEIGHT_SEGMENTS = 32;

export class Planet {
  constructor() {
    const geometry = new THREE.SphereGeometry(
      PLANET_RADIUS,
      WIDTH_SEGMENTS,
      HEIGHT_SEGMENTS,
    );
    const material = new THREE.MeshStandardMaterial({ color: PLANET_COLOR });
    this.root = new THREE.Mesh(geometry, material);
  }
}
