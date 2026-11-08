import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';


export function mountEnergyScene(root, mode = 'hybrid', miniature = false) {
// All artwork is real geometry: no image textures, remote assets, or API keys.
const container = root.querySelector('#canvas-wrap');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches || miniature;
let renderer;
  let animationId, disposed = false, visible = true;
  const disposers = [];
  const listen = (target, event, callback) => { if (!target) return; target.addEventListener(event, callback); disposers.push(() => target.removeEventListener(event, callback)); };
  const compact = root.dataset.compact === 'true';
try {
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
} catch {
  root.classList.add('no-webgl');
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, miniature ? 1 : 1.7));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6, 6, 4, -4, .1, 100);
  camera.position.set(9, 8.5, 12);
  camera.lookAt(0, .7, 0);
  scene.add(new THREE.AmbientLight(0xd6e4ff, 1.4));
  const key = new THREE.DirectionalLight(0xfff3e2, 3.2);
  key.position.set(-3, 9, 7); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: .1, far: 30 });
  key.shadow.bias = -.0005; key.shadow.normalBias = .025; key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa9d6ff, 2.7); rim.position.set(5, 5, -6); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xd2ffed, .7); fill.position.set(-5, 2, -3); scene.add(fill);
  const model = new THREE.Group(); scene.add(model);
  const mat = (color, opts = {}) => new THREE.MeshStandardMaterial({ color, roughness: .7, metalness: .02, ...opts });
  const materials = {
    base: mat('#3a526b'), top: mat('#62778a'), blue: mat('#8db6e8'), blueLight: mat('#b5d7f3'),
    cream: mat('#eef0e7'), mint: mat('#afddc8'), panel: mat('#627fbd'), grid: mat('#b5c9e5'),
    yellow: mat('#f5ce7e'), vent: mat('#6084ac'), dark: mat('#436385'), leaf: mat('#a6ceb8'),
  };
  function box(parent, dims, pos, material, radius = .08) {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(...dims, 4, radius), material);
    mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function sphere(parent, radius, pos, material, scale = [1, 1, 1]) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), material);
    mesh.position.set(...pos); mesh.scale.set(...scale); mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function rod(parent, start, end, radius, material) {
    const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), 16), material);
    mesh.position.copy(a.clone().add(b).multiplyScalar(.5));
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    mesh.castShadow = true; parent.add(mesh); return mesh;
  }
  function cable(points) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'catmullrom', .35);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 70, .035, 10, false), materials.yellow);
    mesh.castShadow = true; model.add(mesh); return curve;
  }
  // A soft, rounded diorama instead of a sharp isometric wireframe.
  box(model, [7, .36, 4.7], [0, -.15, 0], materials.base, .24);
  box(model, [6.88, .13, 4.58], [0, .075, 0], materials.top, .22);
  box(model, [1.25, .025, .10], [0, -.17, 2.355], materials.mint, .035);

  const battery = new THREE.Group(); model.add(battery); battery.position.set(.25, .14, .05);
  box(battery, [2.05, .16, 1.56], [0, .08, 0], materials.dark, .08);
  box(battery, [1.95, 1.7, 1.4], [0, 1.0, 0], materials.blue, .14);
  box(battery, [2.04, .22, 1.49], [0, 1.88, 0], materials.blueLight, .10);
  // Three small storage doors, each with softly inset vents.
  for (let i = 0; i < 3; i++) {
    const x = (i - 1) * .60;
    box(battery, [.55, 1.35, .045], [x, .98, .704], materials.blueLight, .055);
    for (let j = 0; j < 5; j++) box(battery, [.30, .025, .02], [x, .58 + j * .07, .735], materials.vent, .011);
    box(battery, [.028, .17, .025], [x + .16, 1.22, .74], materials.cream, .012);
    box(battery, [.12, .035, .024], [x, 1.49, .737], materials.mint, .015);
  }
  // Side badge and lightning bolt, built as an extrusion.
  box(battery, [.04, .63, .55], [1.0, 1.09, -.03], materials.cream, .11);
  const bolt = new THREE.Shape();
  bolt.moveTo(.055, .22); bolt.lineTo(-.13, -.025); bolt.lineTo(-.025, -.025);
  bolt.lineTo(-.065, -.23); bolt.lineTo(.14, .04); bolt.lineTo(.035, .04); bolt.closePath();
  const boltMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bolt, { depth: .025, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .008, bevelThickness: .008 }), materials.yellow);
  boltMesh.rotation.y = Math.PI / 2; boltMesh.position.set(1.03, 1.1, -.03); battery.add(boltMesh);
  box(battery, [.76, .10, .45], [0, 2.03, 0], materials.cream, .07);
  for (let i = 0; i < 3; i++) box(battery, [.15, .025, .26], [-.21 + i * .21, 2.091, 0], materials.mint, .035);

  const solar = new THREE.Group(); model.add(solar); solar.position.set(-2.0, .14, .45);
  for (const x of [-.66, .66]) {
    box(solar, [.17, .16, 1.34], [x, .08, 0], materials.cream, .06);
    rod(solar, [x, .1, -.42], [x, .85, -.42], .045, materials.cream);
    rod(solar, [x, .1, .42], [x, .46, .42], .045, materials.cream);
  }
  const panel = new THREE.Group(); solar.add(panel); panel.position.y = .68; panel.rotation.x = .38;
  box(panel, [1.89, .13, 1.55], [0, 0, 0], materials.cream, .075);
  box(panel, [1.76, .04, 1.42], [0, .08, 0], materials.panel, .035);
  for (let x = 1; x < 6; x++) box(panel, [.014, .008, 1.38], [-.88 + x * 1.76 / 6, .105, 0], materials.grid, .003);
  for (let z = 1; z < 4; z++) box(panel, [1.72, .008, .014], [0, .106, -.71 + z * 1.42 / 4], materials.grid, .003);

  const grid = new THREE.Group(); model.add(grid); grid.position.set(2.25, .14, -.90);
  box(grid, [.65, .20, .65], [0, .1, 0], materials.cream, .12);
  rod(grid, [0, .15, 0], [0, 2.65, 0], .095, materials.cream);
  box(grid, [1.40, .15, .18], [0, 2.40, 0], materials.cream, .065);
  box(grid, [1.02, .13, .16], [0, 1.95, 0], materials.cream, .06);
  for (const [x, y] of [[-.52, 2.57], [.52, 2.57], [-.35, 2.11], [.35, 2.11]]) {
    box(grid, [.15, .25, .16], [x, y, 0], materials.blueLight, .055);
    box(grid, [.22, .055, .22], [x, y + .03, 0], materials.mint, .025);
  }
  sphere(grid, .10, [0, 2.73, 0], materials.cream);
  // Two little trees give the technology a friendlier sense of scale.
  for (const [x, z, size] of [[-2.4, -1.38, 1], [2.65, 1.3, .70]]) {
    rod(model, [x, .15, z], [x, .65 * size, z], .055, materials.cream);
    sphere(model, .32 * size, [x, .84 * size, z], materials.leaf, [.9, 1.2, .9]);
    sphere(model, .24 * size, [x - .16 * size, .70 * size, z], materials.mint);
  }
  const routes = [
    cable([[-1.8, .17, 1.13], [-1.75, .17, 1.55], [-1.40, .17, 1.73], [-.4, .17, 1.73], [.25, .17, 1.53], [.25, .17, .85]]),
    cable([[1.25, .17, .43], [1.65, .17, .43], [1.96, .17, .16], [1.96, .17, -.65], [2.25, .17, -.86]])
  ];
  const particles = routes.map(() => sphere(model, .065, [0, 0, 0], mat('#fff3c4', { emissive: '#e8c26c', emissiveIntensity: .5 })));

  // Small floating sun + cloud: subtle, rounded, and deliberately sparse.
  const sun = sphere(model, .24, [-2.35, 2.45, -.50], materials.yellow);
  const cloud = new THREE.Group(); model.add(cloud); cloud.position.set(.15, 3.02, -1.60);
  sphere(cloud, .19, [-.22, 0, 0], materials.cream);
  sphere(cloud, .26, [0, .08, 0], materials.cream);
  sphere(cloud, .17, [.24, 0, 0], materials.cream);

  // A wide translucent shadow underneath the floating platform.
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d'); const gradient = ctx.createRadialGradient(64, 64, 5, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,.33)'); gradient.addColorStop(.55, 'rgba(0,0,0,.18)'); gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.65; scene.add(shadow);

  let targetRotation = -.16, currentRotation = -.16, drag = null, time = 0, lastTime = performance.now();
  let mobile = false;
  function resize() {
    const { width, height } = container.getBoundingClientRect(); mobile = width < 760;
    if (!width || !height) return;
    renderer.setSize(width, height);
    const viewWidth = compact ? Math.max(9.2, 6.6 * width / height) : mobile ? 10.7 : 11.9;
    camera.left = -viewWidth / 2; camera.right = viewWidth / 2;
    camera.top = viewWidth * height / width / 2; camera.bottom = -camera.top;
    camera.setViewOffset(width, height, compact ? 0 : mobile ? 0 : -48, compact ? 0 : mobile ? -110 : -50, width, height);
    camera.updateProjectionMatrix();
  }
  const resizer = new ResizeObserver(resize); resizer.observe(container); resize();
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(container);
  listen(container, 'pointerdown', e => { drag = { x: e.clientX, rotation: targetRotation }; container.setPointerCapture(e.pointerId); });
  listen(container, 'pointermove', e => { if (drag) targetRotation = drag.rotation + (e.clientX - drag.x) * .005; });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) listen(container, event, () => { drag = null; });
  listen(root.querySelector('#reset'), 'click', () => { targetRotation = -.16; });
  const motionButton = root.querySelector('#motion');
  function syncMotion() {
    if (!motionButton) return;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'เปิดภาพเคลื่อนไหว' : 'หยุดภาพเคลื่อนไหว');
    root.querySelector('#motion-icon').textContent = paused ? '▷' : 'Ⅱ';
  }
  listen(motionButton, 'click', () => { paused = !paused; syncMotion(); });
  listen(reducedMotion, 'change', e => { paused = e.matches; syncMotion(); }); syncMotion();

  const factory = new THREE.Group(); model.add(factory);
  box(factory,[2.05,1.15,1.6],[.3,.72,0],materials.cream,.16);
  box(factory,[2.2,.17,1.75],[.3,1.36,0],materials.blueLight,.08);
  for(let i=0;i<3;i++) box(factory,[.38,.36,.04],[-.35+i*.6,.86,.82],materials.mint,.05);
  box(factory,[.48,.63,.045],[.8,.51,.83],materials.dark,.04);
  for(let i=0;i<2;i++) rod(factory,[.7+i*.4,1.4,-.45],[.7+i*.4,1.96,-.45],.1,materials.cream);
  function selectMode(next) {
    battery.visible = next !== 'solar';
    solar.visible = next !== 'battery';
    factory.visible = next === 'solar';
    grid.visible = next !== 'solar';
    targetRotation = next === 'solar' ? -.34 : -.16;
  }
  selectMode(mode);
  listen(root,'energy-mode',e=>selectMode(e.detail));
  function frame(now) {
    if (disposed) return;
    if (!visible || document.hidden) { lastTime = now; animationId = requestAnimationFrame(frame); return; }
    // A first RAF timestamp can precede performance.now() used during setup.
    const dt = Math.max(0, Math.min((now - lastTime) / 1000, .05)); lastTime = now;
    if (!paused) time += dt;
    currentRotation += (targetRotation - currentRotation) * (reducedMotion.matches ? 1 : 1 - Math.exp(-8 * dt));
    model.rotation.y = currentRotation;
    model.position.y = paused ? 0 : Math.sin(time * .8) * .035;
    cloud.position.y = 3.02 + (paused ? 0 : Math.sin(time * .7) * .065);
    sun.position.y = 2.45 + (paused ? 0 : Math.sin(time * .8 + 1) * .045);
    particles.forEach((particle, i) => { particle.position.copy(routes[i].getPoint((time * .13 + i * .5) % 1)); particle.position.y += .04; });
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(frame);
  }
  animationId = requestAnimationFrame(frame);
  return () => {
    disposed = true; cancelAnimationFrame(animationId);
    resizer.disconnect(); visibility.disconnect(); disposers.forEach(dispose => dispose());
    scene.traverse(object => {
      object.geometry?.dispose();
      const list = Array.isArray(object.material) ? object.material : [object.material];
      list.filter(Boolean).forEach(material => { material.map?.dispose(); material.dispose(); });
    });
    renderer.dispose(); renderer.domElement.remove();
  };
}
return () => { disposed = true; disposers.forEach(dispose => dispose()); };
}
