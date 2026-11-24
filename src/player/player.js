import * as THREE from 'three';

// placeholders until the real model
const BODY_COLOR = 0x6a4bc4;
const NOSE_COLOR = 0x111111;

const BODY_WIDTH = 0.6;
const BODY_HEIGHT = 1.8;
const BODY_DEPTH = 0.4;

const NOSE_SIZE = 0.2;
const NOSE_LENGTH = 0.4;
const NOSE_HEIGHT = 1.5;

const START_DIRECTION_X = 1;
const START_DIRECTION_Y = 1;
const START_DIRECTION_Z = 3;

const _n = new THREE.Vector3();
const _up = new THREE.Vector3();
const _q = new THREE.Quaternion();

/** @param {THREE.Object3D} root */
function alignToSurface(root) {
  _n.copy(root.position).normalize();
  _up.set(0, 1, 0).applyQuaternion(root.quaternion);
  // the smallest turn, so it tilts without spinning and keeps looking the same way
  _q.setFromUnitVectors(_up, _n);
  // the turn is in world space, multiply would apply it in local space
  root.quaternion.premultiply(_q).normalize();
}

export class Player {
  /** @param {number} planetRadius */
  constructor(planetRadius) {
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(BODY_WIDTH, BODY_HEIGHT, BODY_DEPTH),
      new THREE.MeshStandardMaterial({ color: BODY_COLOR }),
    );
    // boxes are centered, this puts the feet on the ground
    body.position.y = BODY_HEIGHT / 2;

    const nose = new THREE.Mesh(
      new THREE.BoxGeometry(NOSE_SIZE, NOSE_SIZE, NOSE_LENGTH),
      new THREE.MeshStandardMaterial({ color: NOSE_COLOR }),
    );
    // +z is forward, same as the glb models
    nose.position.set(0, NOSE_HEIGHT, BODY_DEPTH / 2 + NOSE_LENGTH / 2);

    this.root = new THREE.Group();
    this.root.add(body, nose);

    this.root.position
      .set(START_DIRECTION_X, START_DIRECTION_Y, START_DIRECTION_Z)
      .normalize()
      .multiplyScalar(planetRadius);
    alignToSurface(this.root);
  }
}
