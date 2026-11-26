import * as THREE from 'three';

const IDLE_CLIP = 'idle';
const WALK_CLIP = 'walk';
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
    this.idleAction.setLoop(THREE.LoopRepeat, Infinity);
    this.walkAction = this.mixer.clipAction(walkClip);
    this.walkAction.setLoop(THREE.LoopRepeat, Infinity);

    this.currentAction = this.idleAction;
    this.currentAction.play();
  }

  /** @param {number} dt */
  update(dt) {
    const nextAction =
      this.player.speed > 0 ? this.walkAction : this.idleAction;
    if (nextAction !== this.currentAction) {
      // a finished fade-out leaves the action disabled, reset turns it back on
      nextAction.reset().play();
      this.currentAction.crossFadeTo(nextAction, FADE_DURATION);
      this.currentAction = nextAction;
    }
    this.mixer.update(dt);
  }
}
