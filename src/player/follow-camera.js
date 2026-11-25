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

// placeholders, tuned later
const MIN_PITCH = -1;
const MAX_PITCH = 0.4;

// the rig faces +z, so its right is -x, not +x
const rigRight = new THREE.Vector3(-1, 0, 0);

export class FollowCamera {
  /**
   * @param {THREE.Camera} camera
   * @param {THREE.Object3D} target
   * @param {{ camDX: number, camDY: number }} intent
   */
  constructor(camera, target, intent) {
    this.target = target;
    this.intent = intent;
    this.pitch = 0;

    // the camera swings up and down around this point and keeps looking at it
    this.pivot = new THREE.Group();
    this.pivot.position.y = LOOK_HEIGHT;

    // the player faces +z, so -z is behind him
    camera.position.set(0, FOLLOW_HEIGHT - LOOK_HEIGHT, -FOLLOW_DISTANCE);
    // lookAt reads a world point, so aim at the pivot before the camera joins it
    camera.lookAt(0, 0, 0);
    this.pivot.add(camera);

    this.root = new THREE.Group();
    this.root.add(this.pivot);
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
    // minus: movementY grows downward, and a positive turn around right looks up
    this.pitch = THREE.MathUtils.clamp(
      this.pitch - this.intent.camDY * MOUSE_SENSITIVITY,
      MIN_PITCH,
      MAX_PITCH,
    );
    this.pivot.quaternion.setFromAxisAngle(rigRight, this.pitch);
  }
}
