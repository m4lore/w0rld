import * as THREE from 'three';
import { alignToSurface } from './player.js';

// placeholders, tuned later
const FOLLOW_DISTANCE = 2;
const FOLLOW_HEIGHT = 2.5;
const LOOK_HEIGHT = 1.5;

// placeholder, tuned later
const FOLLOW_SHARPNESS = 5;

// placeholder, tuned later
const MOUSE_SENSITIVITY = 0.002;

// placeholders, tuned later
const MIN_PITCH = -1;
const MAX_PITCH = 0.4;

// placeholders, tuned later
const EYE_HEIGHT = 1.5;
const EYE_FORWARD = 0.175;
const FIRST_PERSON_MIN_PITCH = -1.3;
const FIRST_PERSON_MAX_PITCH = 1.4;

// the rig faces +z, so its right is -x, not +x
const rigRight = new THREE.Vector3(-1, 0, 0);
// the camera looks down its -z: half a turn and it looks where the rig faces
const lookForward = new THREE.Quaternion().setFromAxisAngle(
  new THREE.Vector3(0, 1, 0),
  Math.PI,
);

export class FollowCamera {
  /**
   * @param {THREE.Camera} camera
   * @param {THREE.Object3D} target
   * @param {{ camDX: number, camDY: number, switchView: boolean }} intent
   */
  constructor(camera, target, intent) {
    this.camera = camera;
    this.target = target;
    this.intent = intent;
    this.pitch = 0;
    this.firstPerson = false;

    // the camera swings up and down around this point and keeps looking at it
    this.pivot = new THREE.Group();
    this.pivot.position.y = LOOK_HEIGHT;

    // the player faces +z, so -z is behind him
    camera.position.set(0, FOLLOW_HEIGHT - LOOK_HEIGHT, -FOLLOW_DISTANCE);
    // lookAt reads a world point, so aim at the pivot before the camera joins it
    camera.lookAt(0, 0, 0);
    this.pivot.add(camera);
    this.behindPosition = camera.position.clone();
    this.behindQuaternion = camera.quaternion.clone();

    this.root = new THREE.Group();
    this.root.add(this.pivot);
    // start on the player, or the camera flies in from the origin
    this.root.position.copy(target.position);
    this.root.quaternion.copy(target.quaternion);
  }

  /** @param {number} dt */
  update(dt) {
    if (this.intent.switchView) {
      this.switchView();
    }

    if (this.firstPerson) {
      // smoothed, the eyes would trail behind the body
      this.root.position.copy(this.target.position);
    } else {
      // a fixed factor per frame would follow faster at higher frame rates
      const catchUp = 1 - Math.exp(-FOLLOW_SHARPNESS * dt);
      this.root.position.lerp(this.target.position, catchUp);
    }
    // its own heading, not the player's: he'll steer relative to the camera, copying his would loop
    alignToSurface(this.root);
    // minus: a positive turn around up goes left
    this.root.rotateY(-this.intent.camDX * MOUSE_SENSITIVITY);
    const minPitch = this.firstPerson ? FIRST_PERSON_MIN_PITCH : MIN_PITCH;
    const maxPitch = this.firstPerson ? FIRST_PERSON_MAX_PITCH : MAX_PITCH;
    // minus: movementY grows downward, and a positive turn around right looks up
    this.pitch = THREE.MathUtils.clamp(
      this.pitch - this.intent.camDY * MOUSE_SENSITIVITY,
      minPitch,
      maxPitch,
    );
    this.pivot.quaternion.setFromAxisAngle(rigRight, this.pitch);
  }

  switchView() {
    this.firstPerson = !this.firstPerson;
    if (this.firstPerson) {
      // forward on the pivot, not on the camera: tilting down would pull the eyes back over the neck
      this.pivot.position.set(0, EYE_HEIGHT, EYE_FORWARD);
      this.camera.position.set(0, 0, 0);
      this.camera.quaternion.copy(lookForward);
    } else {
      this.pivot.position.set(0, LOOK_HEIGHT, 0);
      this.camera.position.copy(this.behindPosition);
      this.camera.quaternion.copy(this.behindQuaternion);
    }
  }
}
