import * as THREE from 'three';
import { WALK_SPEED } from './player.js';

const IDLE_CLIP = 'idle';
const WALK_CLIP = 'walk';
const RUN_CLIP = 'run';
const HIPS_POSITION_TRACK = 'mixamorigHips.position';

// placeholder, tuned later
const FADE_DURATION = 0.2;

/**
 * @param {THREE.AnimationClip[]} clips
 * @param {string} name
 */
function findClip(clips, name) {
  const clip = THREE.AnimationClip.findByName(clips, name);
  if (!clip) {
    throw new Error(`no ${name} clip in the hero model`);
  }
  return clip;
}

/** @param {THREE.AnimationClip} clip */
function keepInPlace(clip) {
  const hips = clip.tracks.find((track) => track.name === HIPS_POSITION_TRACK);
  if (!hips) {
    throw new Error(`no ${HIPS_POSITION_TRACK} track in ${clip.name}`);
  }
  const startZ = hips.values[2];
  // flat x, y, z per key: y holds the hips up and x is only a sway, so pin just z
  for (let i = 2; i < hips.values.length; i += 3) {
    hips.values[i] = startZ;
  }
}

export class HeroAnimation {
  /**
   * @param {THREE.Object3D} model
   * @param {THREE.AnimationClip[]} clips
   * @param {{ speed: number }} player
   */
  constructor(model, clips, player) {
    this.player = player;

    const walkClip = findClip(clips, WALK_CLIP);
    // the player already moves the body, the clip walking too would snap back at every loop
    keepInPlace(walkClip);

    this.mixer = new THREE.AnimationMixer(model);
    this.idleAction = this.mixer.clipAction(findClip(clips, IDLE_CLIP));
    this.walkAction = this.mixer.clipAction(walkClip);
    this.runAction = this.mixer.clipAction(findClip(clips, RUN_CLIP));
    this.actions = [this.idleAction, this.walkAction, this.runAction];

    // all three always play, the weights decide which one shows
    for (const action of this.actions) {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.weight = action === this.idleAction ? 1 : 0;
      action.play();
    }
  }

  pickAction() {
    if (this.player.speed > WALK_SPEED) {
      return this.runAction;
    }
    if (this.player.speed > 0) {
      return this.walkAction;
    }
    return this.idleAction;
  }

  /** @param {number} dt */
  update(dt) {
    const chosen = this.pickAction();
    // weights by hand: crossFadeTo always restarts from 0 and 1, so a quick tap jumps
    const missing = 1 - chosen.weight;
    if (missing > 0) {
      const step = dt / FADE_DURATION;
      // the same share for every weight keeps the sum at 1, below 1 the mixer blends in the rest pose
      const share = Math.min(1, step / missing);
      for (const action of this.actions) {
        const target = action === chosen ? 1 : 0;
        action.weight += (target - action.weight) * share;
      }
    }
    this.mixer.update(dt);
  }
}
