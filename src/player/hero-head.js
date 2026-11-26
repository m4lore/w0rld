import * as THREE from 'three';

const HEAD_BONE = 'mixamorigHead';
// not zero: the head's normals and the bones under it would lose their direction
const HIDDEN_HEAD_SCALE = 0.0001;

export class HeroHead {
  /**
   * @param {THREE.Object3D} model
   * @param {{ firstPerson: boolean }} view
   */
  constructor(model, view) {
    this.view = view;

    const head = model.getObjectByName(HEAD_BONE);
    if (!head) {
      throw new Error(`no ${HEAD_BONE} bone in the hero model`);
    }
    this.head = head;
  }

  update() {
    // no clip animates scale, so the mixer never writes this back
    this.head.scale.setScalar(this.view.firstPerson ? HIDDEN_HEAD_SCALE : 1);
  }
}
