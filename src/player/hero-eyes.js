import * as THREE from 'three';
import { HEAD_BONE } from './hero-head.js';

const noTurn = new THREE.Quaternion();
const _rotation = new THREE.Quaternion();
const _joint = new THREE.Vector3();

export class HeroEyes {
  /**
   * @param {THREE.Object3D} model
   * @param {THREE.AnimationAction} backflipAction
   */
  constructor(model, backflipAction) {
    this.model = model;
    this.backflipAction = backflipAction;

    const head = model.getObjectByName(HEAD_BONE);
    if (!head) {
      throw new Error(`no ${HEAD_BONE} bone in the hero model`);
    }
    this.head = head;

    // before the mixer's first update the bones still hold the rest pose
    const restRotation = new THREE.Quaternion();
    this.restJoint = new THREE.Vector3();
    this.readHead(restRotation, this.restJoint);
    this.restInverse = restRotation.invert();

    this.turn = new THREE.Quaternion();
    this.joint = this.restJoint.clone();
  }

  /**
   * @param {THREE.Quaternion} rotation
   * @param {THREE.Vector3} joint
   */
  readHead(rotation, joint) {
    rotation.identity();
    joint.set(0, 0, 0);
    // local poses, not matrixWorld: it's last frame's until render, and the head's is shrunk
    /** @type {THREE.Object3D | null} */
    let node = this.head;
    while (node && node !== this.model) {
      rotation.premultiply(node.quaternion);
      joint.applyQuaternion(node.quaternion).add(node.position);
      node = node.parent;
    }
  }

  update() {
    this.readHead(_rotation, _joint);
    // the bone's axes aren't the body's, so only the change since rest is a turn of the head
    _rotation.multiply(this.restInverse);
    // the flip's weight fades the turn in and out, so on the ground there's none
    const weight = this.backflipAction.weight;
    this.turn.slerpQuaternions(noTurn, _rotation, weight);
    this.joint.lerpVectors(this.restJoint, _joint, weight);
  }

  /**
   * point is in the model's space, not the bone's or the world's; it's changed in place and returned
   * @param {THREE.Vector3} point
   */
  moveWithHead(point) {
    return point.sub(this.restJoint).applyQuaternion(this.turn).add(this.joint);
  }
}
