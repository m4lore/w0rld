import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { resizeToWindow } from './core/resize.js';
import { Cube } from './world/cube.js';
import { Lights } from './world/lights.js';

const renderer = createRenderer(document.body);
const camera = createCamera();
const scene = new THREE.Scene();

const cube = new Cube();
const lights = new Lights();
scene.add(cube.root, lights.root);

resizeToWindow(renderer, camera);
renderer.render(scene, camera);

window.addEventListener('resize', () => {
  resizeToWindow(renderer, camera);
  // resizing wipes the canvas and there's no loop yet, so draw again
  renderer.render(scene, camera);
});
