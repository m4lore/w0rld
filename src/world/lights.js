import * as THREE from 'three';

// placeholders, the real ones get picked later
const SUN_COLOR = 0xffd8a8;
const SKY_COLOR = 0xc8dcff;
const GROUND_COLOR = 0x7b5fc7;

const SUN_INTENSITY = 3;
const HEMISPHERE_INTENSITY = 1.5;

const SUN_X = 10;
const SUN_Y = 30;
const SUN_Z = 20;

export class Lights {
  constructor() {
    const sun = new THREE.DirectionalLight(SUN_COLOR, SUN_INTENSITY);
    sun.position.set(SUN_X, SUN_Y, SUN_Z);

    const hemisphere = new THREE.HemisphereLight(
      SKY_COLOR,
      GROUND_COLOR,
      HEMISPHERE_INTENSITY,
    );
    // a round planet has no single up, so the sky side faces the sun
    hemisphere.position.copy(sun.position);

    this.root = new THREE.Group();
    this.root.add(sun, hemisphere);
  }
}
