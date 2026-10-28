// Loaded only through next/dynamic (ssr: false) from HeroSpotlight, so it is
// already client-side and can take ref props.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const dustVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uBurst;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    // Rise slowly through the light, wrapping back to the floor
    float rise = mod(p.y + uTime * (0.12 + aSeed * 0.18) + uBurst * 2.5 * aSeed, 4.2);
    p.y = rise;
    p.x += sin(uTime * 0.6 + aSeed * 30.0) * 0.12;
    p.z += cos(uTime * 0.5 + aSeed * 20.0) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (10.0 + aSeed * 18.0) * uPixelRatio / -mv.z;
    // Fade in at the floor and out at the top of the beam
    vAlpha = smoothstep(0.0, 0.6, rise) * (1.0 - smoothstep(3.0, 4.2, rise)) * (0.55 + 0.45 * sin(uTime * 2.0 + aSeed * 60.0));
  }
`;
const dustFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(0.83, 0.67, 0.38, smoothstep(0.5, 0.1, d) * vAlpha);
  }
`;

type Props = {
  stageRef: React.RefObject<HTMLDivElement | null>;
  /** Changes every time a new watch takes the stage: the pedestal spins up and the dust lifts. */
  pulse: number;
};

/**
 * The showroom pedestal: white lacquer with gold rims and a ring of minute
 * markers like a bezel, turning slowly in a beam of gold dust. Writes the
 * on-screen height of its top surface to --plinth-y so the HTML watch can
 * stand exactly on it.
 */
export default function StageScene({ stageRef, pulse }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef({ value: pulse, seen: pulse, at: -10 });

  useEffect(() => {
    pulseRef.current.value = pulse;
  }, [pulse]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.NeutralToneMapping;
    mount.appendChild(renderer.domElement);
    const el = renderer.domElement;
    Object.assign(el.style, { display: "block", width: "100%", height: "100%" });

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 1.1;
    pmrem.dispose();
    const spot = new THREE.SpotLight(0xffe7b8, 60, 20, 0.45, 0.6, 1.5);
    spot.position.set(0, 7, 2);
    scene.add(spot, spot.target);

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 2.6, 10);
    camera.lookAt(0, 0.9, 0);

    // ── Pedestal ────────────────────────────────────────────────────────
    const lacquer = new THREE.MeshPhysicalMaterial({ color: 0xf8f6f1, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06 });
    const gold = new THREE.MeshPhysicalMaterial({ color: 0xdcbf86, metalness: 1, roughness: 0.2, clearcoat: 0.4 });
    const pedestal = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.14, 128), lacquer);
    top.position.y = -0.07;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.0, 0.42, 128), lacquer);
    base.position.y = -0.39;
    const rimTop = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.028, 16, 160), gold);
    rimTop.rotation.x = Math.PI / 2;
    const rimMid = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.022, 16, 160), gold);
    rimMid.rotation.x = Math.PI / 2;
    rimMid.position.y = -0.18;
    const rimBase = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.03, 16, 160), gold);
    rimBase.rotation.x = Math.PI / 2;
    rimBase.position.y = -0.6;
    pedestal.add(top, base, rimTop, rimMid, rimBase);
    // Minute markers around the top, like a bezel
    const markers = new THREE.Group();
    for (let i = 0; i < 60; i++) {
      const major = i % 5 === 0;
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.012, major ? 0.2 : 0.1), gold);
      const a = (i / 60) * Math.PI * 2;
      tick.position.set(Math.sin(a) * (1.55 - (major ? 0.05 : 0)), 0.006, Math.cos(a) * (1.55 - (major ? 0.05 : 0)));
      tick.rotation.y = a;
      markers.add(tick);
    }
    pedestal.add(markers);
    scene.add(pedestal);

    // ── Gold dust in the beam ───────────────────────────────────────────
    const count = 380;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * 1.6;
      const a = Math.random() * Math.PI * 2;
      positions.set([Math.cos(a) * r, Math.random() * 4.2, Math.sin(a) * r], i * 3);
      seeds[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    const dustMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uBurst: { value: 0 }, uPixelRatio: { value: renderer.getPixelRatio() } },
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // ── Layout: report where the pedestal top sits on screen ─────────────
    const surface = new THREE.Vector3();
    const layout = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Keep the whole pedestal in frame on narrow stages
      camera.position.z = camera.aspect < 0.9 ? 12.5 : 10;
      camera.lookAt(0, 0.9, 0);
      camera.updateProjectionMatrix();
      surface.set(0, 0, 0.6).project(camera);
      stageRef.current?.style.setProperty("--plinth-y", `${((1 - surface.y) / 2) * h}px`);
      surface.set(1.7, 0, 0).project(camera);
      stageRef.current?.style.setProperty("--plinth-w", `${surface.x * w}px`);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(mount);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const onMove = (e: PointerEvent) => pointerTarget.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    window.addEventListener("pointermove", onMove);

    const timer = new THREE.Timer();
    timer.connect(document);
    let spin = 0;
    const tick = () => {
      timer.update();
      const t = timer.getElapsed();
      const dt = Math.min(timer.getDelta(), 0.05);

      // A new watch on stage: a quick spin and a lift of dust
      const pulseState = pulseRef.current;
      if (pulseState.value !== pulseState.seen) {
        pulseState.seen = pulseState.value;
        pulseState.at = t;
      }
      const sincePulse = t - pulseState.at;
      const burst = reduce ? 0 : Math.exp(-sincePulse * 2.2);
      spin = (reduce ? 0 : 0.12) + burst * 2.4;
      pedestal.rotation.y += spin * dt;
      dustMat.uniforms.uTime.value = reduce ? 0 : t;
      dustMat.uniforms.uBurst.value = burst;

      pointer.lerp(pointerTarget, 0.05);
      camera.position.x = pointer.x * 0.6;
      camera.position.y = 2.6 + pointer.y * 0.3;
      camera.lookAt(0, 0.9, 0);
      renderer.render(scene, camera);
    };
    const io = new IntersectionObserver(([entry]) => renderer.setAnimationLoop(entry.isIntersecting ? tick : null));
    renderer.setAnimationLoop(tick);
    io.observe(mount);

    return () => {
      renderer.setAnimationLoop(null);
      io.disconnect();
      ro.disconnect();
      timer.dispose();
      window.removeEventListener("pointermove", onMove);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      lacquer.dispose();
      gold.dispose();
      dustMat.dispose();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      el.remove();
    };
  }, [stageRef]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
