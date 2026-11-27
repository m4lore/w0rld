import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { enableDistanceFog } from './core/distance-fog.js';
import { Input } from './core/input.js';
import { startLoop } from './core/loop.js';
import { createRenderer } from './core/renderer.js';
import { resizeToWindow } from './core/resize.js';
import { FollowCamera } from './player/follow-camera.js';
import { HeroAnimation } from './player/hero-animation.js';
import { HeroHead } from './player/hero-head.js';
import { loadHeroModel } from './player/hero-model.js';
import { Player } from './player/player.js';
import { Lights } from './world/lights.js';
import { PLANET_RADIUS, Planet } from './world/planet.js';

// placeholder, the real one gets picked later
const FOG_COLOR = 0xb4aed0;

// placeholders, tuned later
const FOG_NEAR = 3;
const FOG_FAR = 9;

const renderer = createRenderer(document.body);
const input = new Input(renderer.domElement);
const camera = createCamera();
const scene = new THREE.Scene();
// fog only tints meshes, the background needs the same color by hand
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
enableDistanceFog();

const planet = new Planet();
const lights = new Lights();
const hero = await loadHeroModel();
const player = new Player(
  PLANET_RADIUS,
  hero?.model ?? null,
  input.intent,
  camera,
);
const followCamera = new FollowCamera(camera, player.root, input.intent);
scene.add(planet.root, lights.root, player.root, followCamera.root);

/** @type {{ update(dt: number): void }[]} */
const updatables = [input, player, followCamera];
if (hero) {
  updatables.push(
    new HeroHead(hero.model, followCamera),
    new HeroAnimation(hero.model, hero.clips, player),
  );
}

resizeToWindow(renderer, camera);

window.addEventListener('resize', () => {
  resizeToWindow(renderer, camera);
});

startLoop(renderer, scene, camera, updatables);
