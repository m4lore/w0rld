import * as THREE from 'three';

const MAX_DT = 0.1;

/**
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {{ update(dt: number): void }[]} updatables
 */
export function startLoop(renderer, scene, camera, updatables) {
  const timer = new THREE.Timer();
  timer.connect(document);

  renderer.setAnimationLoop((time) => {
    timer.update(time);
    // the first dt can come out a bit negative, and connect doesn't catch a long freeze with the tab visible
    const dt = THREE.MathUtils.clamp(timer.getDelta(), 0, MAX_DT);

    for (const updatable of updatables) {
      updatable.update(dt);
    }

    renderer.render(scene, camera);
  });
}
