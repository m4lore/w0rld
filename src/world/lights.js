import * as THREE from 'three';

const LIGHT_COLOR = 0xffffff;
const SUN_INTENSITY = 3;
const AMBIENT_INTENSITY = 0.5;

const SUN_X = 1;
const SUN_Y = 3;
const SUN_Z = 2;

export class Lights {
  constructor() {
    const sun = new THREE.DirectionalLight(LIGHT_COLOR, SUN_INTENSITY);
    sun.position.set(SUN_X, SUN_Y, SUN_Z);

    const ambient = new THREE.AmbientLight(LIGHT_COLOR, AMBIENT_INTENSITY);

    this.root = new THREE.Group();
    this.root.add(sun, ambient);
  }
}
