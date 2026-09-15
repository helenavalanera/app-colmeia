import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import BeeMascot from "./BeeMascot";

const LOOK_COLORS = { classico: 0x33251f, esportivo: 0xf86700, inverno: 0x294d3a, urbano: 0x18181b };

export default function Bee3D({ equipped = {}, size = 260, variant, expression }) {
  const host = useRef(null);
  const reactToTouch = useRef(() => {});
  const [fallback, setFallback] = useState(false);
  const [hello, setHello] = useState(false);
  const helloTimer = useRef(null);
  const character = variant || (equipped.personagem === "hatch" ? "hatch" : "flor");
  const face = expression || equipped.expressao || "feliz";
  const look = equipped.look || "classico";
  const accessory = equipped.acessorio || "";
  const isFlor = character === "flor";

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
    light.position.set(-3, 7, 5);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    scene.add(light);
    const rim = new THREE.DirectionalLight(0xffb44c, 2);
    rim.position.set(4, 3, -2);
    scene.add(rim);

    const bee = new THREE.Group();
    scene.add(bee);
    const yellow = new THREE.MeshStandardMaterial({ color: isFlor ? 0xffb51b : 0xffae12, roughness: 0.32 });
    const black = new THREE.MeshStandardMaterial({ color: 0x25252d, roughness: 0.46 });
    const brown = new THREE.MeshStandardMaterial({ color: 0x3b2318, roughness: 0.56 });
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.22 });
    const orange = new THREE.MeshStandardMaterial({ color: 0xf86700, roughness: 0.35 });
    const pink = new THREE.MeshStandardMaterial({ color: 0xfb906d, roughness: 0.6 });
    const outfitColor = equipped.roupa === "camisa_roxa" ? 0xb2a1ed : equipped.roupa === "camisa_lima" ? 0xc7d98a : LOOK_COLORS[look];
    const outfit = new THREE.MeshStandardMaterial({ color: outfitColor, roughness: 0.65 });
    const wing = new THREE.MeshStandardMaterial({ color: 0xe6efff, transparent: true, opacity: .64, roughness: .18, metalness: .12 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: .25, metalness: .35 });
    const materials = [yellow, black, brown, white, orange, pink, outfit, wing, glass];
    const blinkMeshes = [];
    const wings = [];

    function sphere(parent, material, position, scale, segments = 32) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, segments, 24), material);
      mesh.position.set(...position);
      mesh.scale.set(...scale);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }
    function curve(points, radius, material, parent = bee) {
      const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), 24, radius, 8, false);
      const mesh = new THREE.Mesh(geometry, material);
      parent.add(mesh);
      return mesh;
    }
    function torus(position, scale, material, parent = bee) {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(1, .09, 12, 32), material);
      mesh.position.set(...position);
      mesh.scale.set(...scale);
      parent.add(mesh);
      return mesh;
    }

    if (accessory === "mochila") sphere(bee, outfit, [0, 1.42, -.48], [.66, .76, .24]);
    [-1, 1].forEach((side) => {
      sphere(bee, black, [side * .29, .49, 0], [.17, .32, .17]);
      sphere(bee, white, [side * .31, .22, .18], [.29, .17, .43]);
      sphere(bee, orange, [side * .31, .28, .23], [.25, .12, .34]);
      const currentWing = sphere(bee, wing, [side * .73, 1.7, -.34], [.42, .69, .13]);
      currentWing.rotation.z = side * -.55;
      wings.push({ mesh: currentWing, base: side * -.55, side });
      const arm = sphere(bee, yellow, [side * .7, 1.24, .04], [.2, .43, .21]);
      arm.rotation.z = side * .3;
      sphere(bee, yellow, [side * .81, .95, .13], [.23, .25, .22]);
    });

    sphere(bee, yellow, [0, 1.25, 0], [.64, .8, .5]);
    sphere(bee, black, [0, 1.06, .015], [.63, .17, .505]);
    sphere(bee, outfit, [0, 1.48, .03], [.65, .44, .52]);
    sphere(bee, orange, [0, 1.52, .54], [.12, .12, .03]);
    if (isFlor || equipped.saia) {
      const skirtColor = equipped.saia === "saia_lima" ? 0xc7d98a : look === "inverno" ? 0x294d3a : look === "urbano" ? 0x29292d : 0xf4a900;
      const skirtMaterial = new THREE.MeshStandardMaterial({ color: skirtColor, roughness: .65 });
      materials.push(skirtMaterial);
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(.52, .83, .43, 32), skirtMaterial);
      skirt.position.y = .92;
      skirt.castShadow = true;
      bee.add(skirt);
    }
    if (look === "inverno") torus([0, 1.82, .05], [.47, .47, .23], orange);

    if (isFlor) {
      sphere(bee, brown, [0, 2.56, -.18], [.86, .7, .54]);
      sphere(bee, brown, [-.72, 2.43, -.02], [.28, .6, .28]);
      sphere(bee, brown, [.72, 2.43, -.02], [.28, .6, .28]);
    }
    sphere(bee, yellow, [0, 2.33, .06], [isFlor ? .94 : .9, .83, .7]);
    if (!isFlor) {
      for (let index = 0; index < 7; index += 1) {
        const spike = new THREE.Mesh(new THREE.ConeGeometry(.18, .62, 10), brown);
        spike.position.set((index - 3) * .2, 3.05 + (index % 2) * .08, -.04);
        spike.rotation.z = (index - 3) * -.08;
        spike.castShadow = true;
        bee.add(spike);
      }
    }

    [-1, 1].forEach((side) => {
      const eyeHeight = face === "risonha" ? .2 : .33;
      const eye = sphere(bee, white, [side * .32, 2.45, .655], [isFlor ? .27 : .245, eyeHeight, .105]);
      const pupil = sphere(bee, black, [side * .3, face === "pensativa" ? 2.49 : 2.43, .752], [.12, face === "risonha" ? .1 : .19, .065]);
      const shine = sphere(bee, white, [side * .3 - .025, 2.5, .81], [.04, .055, .025]);
      blinkMeshes.push({ mesh: eye, base: eye.scale.y }, { mesh: pupil, base: pupil.scale.y }, { mesh: shine, base: shine.scale.y });
      sphere(bee, pink, [side * .59, 2.14, .6], [.16, .09, .025]);
      curve([[side * .36, 2.93, 0], [side * .44, 3.25, 0], [side * .63, 3.4, .03]], .047, black);
      sphere(bee, black, [side * .63, 3.4, .03], [.12, .13, .12]);
      if (isFlor) {
        curve([[side * .5, 2.62, .73], [side * .62, 2.7, .72]], .018, brown);
        curve([[side * .51, 2.58, .74], [side * .66, 2.61, .72]], .018, brown);
      }
      if (face === "determinada") curve([[side * .5, 2.72, .72], [side * .16, 2.66, .78]], .026, brown);
      if (face === "pensativa") curve([[side * .5, 2.7 + side * .04, .72], [side * .16, 2.71 - side * .04, .78]], .024, brown);
    });

    if (face === "surpresa") sphere(bee, black, [0, 2.08, .76], [.11, .15, .04]);
    else if (face === "risonha") curve([[-.25, 2.13, .72], [0, 1.96, .79], [.25, 2.13, .72]], .038, black);
    else curve([[-.22, 2.1, .714], [0, face === "determinada" ? 2.03 : 1.99, .751], [.22, 2.1, .714]], .03, black);

    if (accessory === "flor" || equipped.chapeu === "chapeu_flor") {
      for (let index = 0; index < 6; index += 1) {
        const angle = index * Math.PI * 2 / 6;
        sphere(bee, orange, [.67 + Math.cos(angle) * .18, 2.96 + Math.sin(angle) * .18, .47], [.13, .13, .06]);
      }
      sphere(bee, yellow, [.67, 2.96, .54], [.1, .1, .07]);
    }
    if (equipped.chapeu === "chapeu_grao") {
      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.1, .1, .85), black);
      cap.position.set(0, 3.08, .05);
      cap.rotation.z = -.1;
      bee.add(cap);
    }
    if (accessory === "oculos") {
      [-1, 1].forEach((side) => torus([side * .33, 2.44, .79], [.28, .33, .12], glass));
      curve([[-.06, 2.45, .8], [0, 2.49, .82], [.06, 2.45, .8]], .018, glass);
    }
    if (accessory === "fone") {
      torus([0, 2.5, -.02], [1.02, 1.03, .82], black);
      sphere(bee, orange, [-.9, 2.4, .02], [.14, .3, .22]);
      sphere(bee, orange, [.9, 2.4, .02], [.14, .3, .22]);
    }
    if (accessory === "bolsa") {
      curve([[-.6, 1.76, .42], [.1, 1.36, .59], [.55, .86, .4]], .035, brown);
      const bag = new THREE.Mesh(new THREE.BoxGeometry(.48, .42, .18), orange);
      bag.position.set(.55, .82, .4);
      bag.rotation.z = -.12;
      bee.add(bag);
    }

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: .18 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let visible = true;
    let bounceUntil = 0;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(element);
    reactToTouch.current = () => { bounceUntil = performance.now() + 900; };
    function animate(now) {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      const bouncing = !reducedMotion.matches && now < bounceUntil;
      bee.position.y = reducedMotion.matches ? 0 : bouncing ? Math.abs(Math.sin((bounceUntil - now) / 110)) * .24 : Math.sin(now / 1100) * .025;
      bee.rotation.y = reducedMotion.matches ? -.12 : -.12 + Math.sin(now / (bouncing ? 140 : 2400)) * (bouncing ? .22 : .09);
      const blinkPhase = (now + (isFlor ? 0 : 1300)) % 4300;
      const blinkScale = reducedMotion.matches || blinkPhase < 4070 ? 1 : Math.max(.08, Math.abs((blinkPhase - 4180) / 110));
      blinkMeshes.forEach(({ mesh, base }) => { mesh.scale.y = base * blinkScale; });
      wings.forEach(({ mesh, base, side }) => { mesh.rotation.z = base + (reducedMotion.matches ? 0 : Math.sin(now / (bouncing ? 55 : 900)) * .045 * side); });
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      clearTimeout(helloTimer.current);
      scene.traverse((object) => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
      [...materials, floor.material].forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
      reactToTouch.current = () => {};
    };
  }, [accessory, character, equipped.chapeu, equipped.roupa, equipped.saia, face, isFlor, look, size]);

  function greet() {
    reactToTouch.current();
    setHello(true);
    clearTimeout(helloTimer.current);
    helloTimer.current = setTimeout(() => setHello(false), 1800);
  }

  const characterName = isFlor ? "Abelha Flor" : "Hatch";
  return <div className="co-bee3d" style={{ maxWidth: size }}>
    <button className="co-bee3d-touch" onClick={greet} aria-label={`Interagir com ${characterName}`}>
      {fallback ? <BeeMascot size={size * .72} equipped={equipped} /> : <span ref={host} className="co-bee3d-canvas" aria-hidden="true" />}
    </button>
    <span className="co-bee-greeting" role="status">{hello ? `${characterName} adorou o toque!` : "Toque no personagem para interagir"}</span>
  </div>;
}
