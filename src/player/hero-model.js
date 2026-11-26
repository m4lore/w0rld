import * as THREE from 'three';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const HERO_URL = '/models/hero.glb';

export async function loadHeroModel() {
  const loader = new GLTFLoader();
  // the file is meshopt-compressed, without the decoder the loader throws
  loader.setMeshoptDecoder(MeshoptDecoder);

  try {
    const gltf = await loader.loadAsync(HERO_URL);
    // already in metres, feet at the origin and facing +z: no scale or offset needed
    const model = gltf.scene;
    model.traverse((object) => {
      // the culling sphere is measured once, on the first pose, so the hero can vanish when a later pose sticks out of it
      if (object instanceof THREE.Mesh) {
        object.frustumCulled = false;
      }
    });
    return { model, clips: gltf.animations };
  } catch (error) {
    // models are not in the repo, so a fresh clone has to start without them
    console.warn(`no model at ${HERO_URL}, using the placeholder`, error);
    return null;
  }
}
