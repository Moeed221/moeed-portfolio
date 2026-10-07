import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import { useInViewport, usePageVisible } from "./utils/useInViewport";

type DesignTool = {
  name: string;
  abbreviation: string;
  background: string;
  foreground: string;
};

const designTools: DesignTool[] = [
  { name: "FIGMA", abbreviation: "F", background: "#F6F6F6", foreground: "#F24E1E" },
  { name: "FIGJAM", abbreviation: "FJ", background: "#A259FF", foreground: "#FFFFFF" },
  { name: "ADOBE XD", abbreviation: "Xd", background: "#2D001E", foreground: "#FF61F6" },
  { name: "PHOTOSHOP", abbreviation: "Ps", background: "#001E36", foreground: "#31A8FF" },
  { name: "ILLUSTRATOR", abbreviation: "Ai", background: "#330000", foreground: "#FF9A00" },
  { name: "MIRO", abbreviation: "M", background: "#FFD02F", foreground: "#050038" },
  { name: "FRAMER", abbreviation: "F", background: "#0055FF", foreground: "#FFFFFF" },
];

const createToolTexture = (tool: DesignTool) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) return new THREE.Texture();

  context.fillStyle = tool.background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = tool.foreground;
  context.globalAlpha = 0.22;
  context.lineWidth = 16;
  context.strokeRect(28, 28, 456, 456);
  context.globalAlpha = 1;
  context.fillStyle = tool.foreground;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 220px Arial, sans-serif";
  context.fillText(tool.abbreviation, 256, 220);
  context.font = "700 46px Arial, sans-serif";
  context.fillText(tool.name, 256, 372);
  context.font = "500 28px Arial, sans-serif";
  context.fillText("UI / UX TOOL", 256, 424);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const textures = designTools.map(createToolTexture);
const toolTextureVersion = "ui-ux-tools-v3";

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map((_, index) => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
  toolIndex: index % textures.length,
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const force = useMemo(() => new THREE.Vector3(), []);
  const position = useMemo<[number, number, number]>(() => [r(20), r(20) - 25, r(20) - 10], [r]);

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        force.set(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={position}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      target.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const container = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(container);
  const isPageVisible = usePageVisible();
  const isActive = isInViewport && isPageVisible;
  const materials = useMemo(
    () =>
      textures.map(
        (texture) =>
          new THREE.MeshPhysicalMaterial({
            map: texture,
            emissive: "#ffffff",
            emissiveMap: texture,
            emissiveIntensity: 0.55,
            metalness: 0.08,
            roughness: 0.32,
            clearcoat: 0.42,
            clearcoatRoughness: 0.15,
          })
      ),
    []
  );
  useEffect(() => () => materials.forEach((material) => material.dispose()), [materials]);

  return (
    <div className="techstack" ref={container}>
      <h2> My Design Toolkit</h2>

      <Canvas
        key={toolTextureVersion}
        shadows
        frameloop={isActive ? "always" : "never"}
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]} paused={!isActive} updateLoop="follow">
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              {...props}
              material={materials[props.toolIndex]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
