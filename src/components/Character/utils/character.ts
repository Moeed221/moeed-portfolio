import * as THREE from "three";
import { DRACOLoader, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";
import { disposeObject } from "./disposeObject";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (signal?: AbortSignal) => {
    try {
      const decrypted = await decryptFile("/models/character.enc?v=2", "MyCharacter12", signal);
      signal?.throwIfAborted();
      // Parse the buffer directly instead of creating a retained Blob URL.
      const gltf = await loader.parseAsync(decrypted, "");
      const character = gltf.scene;
      try {
        signal?.throwIfAborted();
        character.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          // Preserve the original materials and clothing colors.
          if (child.name === "BODY.SHIRT" || child.name === "Pant") {
            const material = (child.material as THREE.MeshStandardMaterial).clone();
            material.color.set(child.name === "BODY.SHIRT" ? "#8B4513" : "#000000");
            child.material = material;
          }
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;
        });
        await renderer.compileAsync(character, camera, scene);
        signal?.throwIfAborted();
        character.getObjectByName("footR")!.position.y = 3.36;
        character.getObjectByName("footL")!.position.y = 3.36;
        return gltf;
      } catch (error) {
        disposeObject(character);
        throw error;
      }
    } finally {
      dracoLoader.dispose();
    }
  };
  return { loadCharacter };
};

export default setCharacter;
