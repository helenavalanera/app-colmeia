import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import BeeMascot from "./BeeMascot";

// Personagem original modelado com volumes. Não depende de modelo ou serviço externo.
export default function Bee3D({ equipped = {}, size = 260 }) {
  const host = useRef(null);
  const reactToTouch = useRef(() => {});
  const [fallback, setFallback] = useState(false);
  const [hello, setHello] = useState(false);
  const helloTimer = useRef(null);
  const { roupa, chapeu, saia } = equipped;
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
    catch { setFallback(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size * 1.12);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1 / 1.12, 0.1, 100);
    camera.position.set(0, 2.3, 8.8);
    camera.lookAt(0, 1.75, 0);
    scene.add(new THREE.HemisphereLight(0xfff6de, 0x5a416f, 2.5));
    const light = new THREE.DirectionalLight(0xfff3d6, 4);
    light.position.set(-3, 7, 5); light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024); scene.add(light);
    const rim = new THREE.DirectionalLight(0xffb44c, 2); rim.position.set(4, 3, -2); scene.add(rim);
    const bee = new THREE.Group(); scene.add(bee);
    const yellow = new THREE.MeshStandardMaterial({ color: 0xffb51b, roughness: 0.32 });
    const black = new THREE.MeshStandardMaterial({ color: 0x25252d, roughness: 0.46 });
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xf86700, roughness: 0.35 });
    const pink = new THREE.MeshStandardMaterial({ color: 0xfb906d, roughness: 0.6 });
    const shirt = new THREE.MeshStandardMaterial({ color: roupa === "camisa_roxa" ? 0xb2a1ed : 0xc7d98a, roughness: 0.72 });
    const wing = new THREE.MeshStandardMaterial({ color: 0xe6efff, transparent: true, opacity: .7, roughness: .18, metalness: .12 });
    const materials = [yellow, black, white, orange, pink, shirt, wing];
    function sphere(parent, material, position, scale) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), material);
      mesh.position.set(...position); mesh.scale.set(...scale); mesh.castShadow = true;
      parent.add(mesh); return mesh;
    }
    function curve(points, radius, material) {
      const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), 24, radius, 8, false);
      const mesh = new THREE.Mesh(geometry, material); bee.add(mesh); return mesh;
    }
    // Tênis, pernas, corpo listrado e braços de um mascote meio humanoide.
    [-1, 1].forEach((side) => {
      sphere(bee, black, [side * .29, .49, 0], [.17, .32, .17]);
      sphere(bee, white, [side * .31, .22, .18], [.29, .17, .43]);
      sphere(bee, orange, [side * .31, .28, .23], [.25, .12, .34]);
      const w = sphere(bee, wing, [side * .73, 1.7, -.34], [.42, .69, .13]); w.rotation.z = side * -.55;
      const arm = sphere(bee, yellow, [side * .7, 1.22, .04], [.2, .42, .21]); arm.rotation.z = side * .3;
      sphere(bee, yellow, [side * .81, .94, .13], [.23, .25, .22]);
    });
    sphere(bee, yellow, [0, 1.25, 0], [.62, .8, .49]);
    sphere(bee, black, [0, 1.06, .015], [.615, .17, .495]);
    sphere(bee, black, [0, 1.47, .015], [.6, .14, .485]);
    if (roupa) { sphere(bee, shirt, [0, 1.53, .02], [.64, .43, .52]); sphere(bee, orange, [0, 1.57, .525], [.12, .12, .03]); }
    if (saia) {
      const material = new THREE.MeshStandardMaterial({ color: saia === "saia_lima" ? 0xc7d98a : 0xf86700, roughness: .65 }); materials.push(material);
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.55, .8, .43, 32), material); skirt.position.y = .92; bee.add(skirt);
    }
    sphere(bee, yellow, [0, 2.33, .06], [.92, .82, .69]);
    [-1, 1].forEach((side) => {
      sphere(bee, white, [side * .32, 2.45, .655], [.245, .32, .105]);
      sphere(bee, black, [side * .3, 2.43, .752], [.12, .19, .065]);
      sphere(bee, white, [side * .3 - .025, 2.5, .81], [.04, .055, .025]);
      sphere(bee, pink, [side * .59, 2.14, .6], [.16, .09, .025]);
      curve([[side * .36, 2.93, 0], [side * .44, 3.25, 0], [side * .63, 3.4, .03]], .047, black);
      sphere(bee, black, [side * .63, 3.4, .03], [.12, .13, .12]);
    });
    curve([[-.22, 2.1, .714], [0, 1.99, .751], [.22, 2.1, .714]], .03, black);
    if (chapeu === "chapeu_flor") {
      for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5; sphere(bee, pink, [.66 + Math.cos(a) * .18, 2.95 + Math.sin(a) * .18, .46], [.13, .13, .06]); }
      sphere(bee, orange, [.66, 2.95, .53], [.1, .1, .07]);
    } else if (chapeu === "chapeu_grao") {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, .1, .85), black); cap.position.set(0, 3.08, .05); cap.rotation.z = -.1; bee.add(cap);
      curve([[.43, 3.12, .35], [.57, 2.96, .4], [.59, 2.77, .42]], .035, orange);
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: .18 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame, visible = true, bounceUntil = 0;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observer.observe(element);
    reactToTouch.current = () => { bounceUntil = performance.now() + 900; };
    function animate(now) {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const bouncing = !motion.matches && now < bounceUntil;
      bee.position.y = motion.matches ? 0 : bouncing ? Math.abs(Math.sin((bounceUntil - now) / 110)) * .24 : Math.sin(now / 1100) * .025;
      bee.rotation.y = motion.matches ? -.12 : -.12 + Math.sin(now / (bouncing ? 140 : 2400)) * (bouncing ? .22 : .09);
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); clearTimeout(helloTimer.current);
      scene.traverse((obj) => { if (obj instanceof THREE.Mesh) obj.geometry.dispose(); });
      [...materials, floor.material].forEach((m) => m.dispose());
      renderer.dispose(); renderer.domElement.remove(); reactToTouch.current = () => {};
    };
  }, [roupa, chapeu, saia, size]);
  function greet() { reactToTouch.current(); setHello(true); clearTimeout(helloTimer.current); helloTimer.current = setTimeout(() => setHello(false), 1800); }
  return <div className="co-bee3d" style={{ maxWidth: size }}>
    <button className="co-bee3d-touch" onClick={greet} aria-label="Dar um oi para minha abelha 3D">
      {fallback ? <BeeMascot size={size * .72} equipped={equipped} /> : <span ref={host} className="co-bee3d-canvas" aria-hidden="true" />}
    </button>
    <span className="co-bee-greeting" role="status">{hello ? "Bzz! Vamos criar algo juntos? ✦" : "Toque para dar um oi"}</span>
  </div>;
}
