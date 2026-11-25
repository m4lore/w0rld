import * as THREE from 'three';
import { alignToSurface } from './player.js';

// placeholders, tuned later
const FOLLOW_DISTANCE = 5;
const FOLLOW_HEIGHT = 2.5;
const LOOK_HEIGHT = 1.5;

// placeholder, tuned later
const FOLLOW_SHARPNESS = 5;

// placeholder, tuned later
const MOUSE_SENSITIVITY = 0.002;

export class FollowCamera {
  /**
   * @param {THREE.Camera} camera
   * @param {THREE.Object3D} target
   * @param {{ camDX: number }} intent
   */
  constructor(camera, target, intent) {
    this.target = target;
    this.intent = intent;

    // the player faces +z, so -z is behind him
    camera.position.set(0, FOLLOW_HEIGHT, -FOLLOW_DISTANCE);
    // lookAt reads a world point, so aim before the camera joins the rig
    camera.lookAt(0, LOOK_HEIGHT, 0);

    this.root = new THREE.Group();
    this.root.add(camera);
    // start on the player, or the camera flies in from the origin
    this.root.position.copy(target.position);
    this.root.quaternion.copy(target.quaternion);
  }

  /** @param {number} dt */
  update(dt) {
    // a fixed factor per frame would follow faster at higher frame rates
    const catchUp = 1 - Math.exp(-FOLLOW_SHARPNESS * dt);
    this.root.position.lerp(this.target.position, catchUp);
    // its own heading, not the player's: he'll steer relative to the camera, copying his would loop
    alignToSurface(this.root);
    // minus: a positive turn around up goes left
    this.root.rotateY(-this.intent.camDX * MOUSE_SENSITIVITY);
  }
}
