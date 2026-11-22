import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { startLoop } from './core/loop.js';
import { createRenderer } from './core/renderer.js';
import { resizeToWindow } from './core/resize.js';
import { Lights } from './world/lights.js';
import { Planet } from './world/planet.js';

const renderer = createRenderer(document.body);
const camera = createCamera();
const scene = new THREE.Scene();

const planet = new Planet();
const lights = new Lights();
scene.add(planet.root, lights.root);

const updatables = [];

resizeToWindow(renderer, camera);

window.addEventListener('resize', () => {
  resizeToWindow(renderer, camera);
});

startLoop(renderer, scene, camera, updatables);
