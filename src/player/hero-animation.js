import * as THREE from 'three';

const IDLE_CLIP = 'idle';

/**
 * @param {THREE.Object3D} model
 * @param {THREE.AnimationClip[]} clips
 */
export function createHeroMixer(model, clips) {
  const idleClip = THREE.AnimationClip.findByName(clips, IDLE_CLIP);
  if (!idleClip) {
    throw new Error(`no ${IDLE_CLIP} clip in the hero model`);
  }

  const mixer = new THREE.AnimationMixer(model);
  const idleAction = mixer.clipAction(idleClip);
  idleAction.setLoop(THREE.LoopRepeat, Infinity);
  idleAction.play();
  return mixer;
}
