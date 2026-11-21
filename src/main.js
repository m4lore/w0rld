import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { resizeToWindow } from './core/resize.js';

const renderer = createRenderer(document.body);
const camera = createCamera();
const scene = new THREE.Scene();

resizeToWindow(renderer, camera);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
  resizeToWindow(renderer, camera);
  // resizing wipes the canvas and there's no loop yet, so draw again
  renderer.render(scene, camera);
});
