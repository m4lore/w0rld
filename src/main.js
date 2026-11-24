import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { startLoop } from './core/loop.js';
import { createRenderer } from './core/renderer.js';
import { resizeToWindow } from './core/resize.js';
import { Player } from './player/player.js';
import { Lights } from './world/lights.js';
import { PLANET_RADIUS, Planet } from './world/planet.js';

// placeholder, the real one gets picked later
const FOG_COLOR = 0xb4aed0;

const FOG_NEAR = 20;
const FOG_FAR = 32;

const renderer = createRenderer(document.body);
const camera = createCamera();
const scene = new THREE.Scene();
// fog only tints meshes, the background needs the same color by hand
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const planet = new Planet();
const lights = new Lights();
const player = new Player(PLANET_RADIUS);
scene.add(planet.root, lights.root, player.root);

const updatables = [player];

resizeToWindow(renderer, camera);

window.addEventListener('resize', () => {
  resizeToWindow(renderer, camera);
});

startLoop(renderer, scene, camera, updatables);
