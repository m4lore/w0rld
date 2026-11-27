import * as THREE from 'three';

// placeholders for when the model file is missing
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

// placeholders, tuned later
const WALK_SPEED = 3;
const RUN_SPEED = 6;

// placeholder, tuned later
const TURN_SHARPNESS = 12;

const _n = new THREE.Vector3();
const _up = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _forward = new THREE.Vector3();
const _cameraQuaternion = new THREE.Quaternion();
const _cameraRight = new THREE.Vector3();
const _cameraForward = new THREE.Vector3();
const _move = new THREE.Vector3();
const _left = new THREE.Vector3();
const _basis = new THREE.Matrix4();
const _facing = new THREE.Quaternion();

/** @param {THREE.Object3D} root */
export function alignToSurface(root) {
  _n.copy(root.position).normalize();
  _up.set(0, 1, 0).applyQuaternion(root.quaternion);
  // the smallest turn, so it tilts without spinning and keeps looking the same way
  _q.setFromUnitVectors(_up, _n);
  // the turn is in world space, multiply would apply it in local space
  root.quaternion.premultiply(_q).normalize();
}

function createPlaceholder() {
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

  const placeholder = new THREE.Group();
  placeholder.add(body, nose);
  return placeholder;
}

export class Player {
  /**
   * @param {number} planetRadius
   * @param {THREE.Object3D | null} model
   * @param {{ moveX: number, moveY: number, run: boolean }} intent
   * @param {THREE.Camera} camera
   */
  constructor(planetRadius, model, intent, camera) {
    this.planetRadius = planetRadius;
    this.intent = intent;
    this.camera = camera;
    this.speed = 0;

    this.model = model ?? createPlaceholder();
    this.root = new THREE.Group();
    this.root.add(this.model);

    this.root.position
      .set(START_DIRECTION_X, START_DIRECTION_Y, START_DIRECTION_Z)
      .normalize()
      .multiplyScalar(planetRadius);
    alignToSurface(this.root);
  }

  /** @param {number} dt */
  update(dt) {
    const moving = this.intent.moveX !== 0 || this.intent.moveY !== 0;
    const moveSpeed = this.intent.run ? RUN_SPEED : WALK_SPEED;
    this.speed = moving ? moveSpeed : 0;
    if (moving) {
      this.turnTowardMoveDirection(dt);
    }
    // along the nose, not the keys: while he turns he walks a curve
    _forward.set(0, 0, 1).applyQuaternion(this.root.quaternion);
    this.root.position.addScaledVector(_forward, this.speed * dt);
    // a straight step lifts off the sphere a little
    this.root.position.normalize().multiplyScalar(this.planetRadius);
    alignToSurface(this.root);
  }

  /** @param {number} dt */
  turnTowardMoveDirection(dt) {
    _up.set(0, 1, 0).applyQuaternion(this.root.quaternion);
    this.camera.getWorldQuaternion(_cameraQuaternion);
    // its right, not where it looks: the camera tilts around its right, so the right stays level
    _cameraRight
      .set(1, 0, 0)
      .applyQuaternion(_cameraQuaternion)
      .projectOnPlane(_up)
      .normalize();
    _cameraForward.crossVectors(_up, _cameraRight);
    _move
      .set(0, 0, 0)
      .addScaledVector(_cameraForward, this.intent.moveY)
      .addScaledVector(_cameraRight, this.intent.moveX)
      // setFromRotationMatrix wants arrows of length 1, and a diagonal is longer
      .normalize();
    _left.crossVectors(_up, _move);
    // he faces +z, so his x is his left, not his right
    _basis.makeBasis(_left, _up, _move);
    _facing.setFromRotationMatrix(_basis);
    const turn = 1 - Math.exp(-TURN_SHARPNESS * dt);
    // both poses share the up, so slerp turns only around it, even when he turns back
    this.root.quaternion.slerp(_facing, turn);
  }
}
