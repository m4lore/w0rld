import * as THREE from 'three';

// placeholders, tuned later
const FOLLOW_DISTANCE = 5;
const FOLLOW_HEIGHT = 2.5;
const LOOK_HEIGHT = 1.5;

export class FollowCamera {
  /**
   * @param {THREE.Camera} camera
   * @param {THREE.Object3D} target
   */
  constructor(camera, target) {
    this.target = target;

    // the player faces +z, so -z is behind him
    camera.position.set(0, FOLLOW_HEIGHT, -FOLLOW_DISTANCE);
    // lookAt reads a world point, so aim before the camera joins the rig
    camera.lookAt(0, LOOK_HEIGHT, 0);

    this.root = new THREE.Group();
    this.root.add(camera);
  }

  update() {
    this.root.position.copy(this.target.position);
    this.root.quaternion.copy(this.target.quaternion);
  }
}
