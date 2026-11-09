import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/** EGAT Product Studio V5 models (Solar PPA / Solar + Battery / Battery), from EGAT-Product-Studio-V5.zip.
 * Changes for the workspace: npm Three.js import, optional gentle sway (options.sway) and a smaller shadow map
 * option (options.shadowSize) so three cards can run side by side.
 *
 * Real geometry, local dependencies, no textures or external services.
 * Returns { exportCanvas(width, height), setMotion(on), setFocus(parts), reset(), dispose() }.
 * product 'all' puts solar, battery and grid on one platform (the landing page); setFocus(['solar','battery'])
 * lifts those parts and lights the deck under them.
 * Each instance owns its geometry, renderer and event listeners.
 */
export function mountProductScene(container, product = 'solar', options = {}) {
  options = { ...options, swayInitial: options.sway };
  if (!['solar', 'hybrid', 'battery', 'all'].includes(product)) throw new Error('Unknown product');
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, .1, 50);
  camera.position.set(8.4, 8.2, 11.7);
  camera.lookAt(0, options.lookY ?? 1.05, 0);
  scene.add(new THREE.HemisphereLight(0xdbeeff, 0x34425e, 2.5));
  const key = new THREE.DirectionalLight(0xfff1df, 3.5);
  key.position.set(-3, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(options.shadowSize ?? 2048, options.shadowSize ?? 2048);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: .1, far: 30 });
  key.shadow.bias = -.00025;
  key.shadow.normalBias = .035;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb5dcff, 2);
  rim.position.set(3, 5, -6); scene.add(rim);
  const model = new THREE.Group(); scene.add(model);
  const material = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .55, metalness: .05, ...extra });
  const m = {
    base: material('#273f5c'), deck: material('#65849b'), white: material('#e2edf0'),
    ice: material('#a9cae4'), blue: material('#7aa7d3'), edge: material('#537da5'),
    cell: material('#456fae', { roughness: .3, metalness: .18 }),
    cell2: material('#5786bb', { roughness: .32, metalness: .18 }),
    line: material('#a8c9e5'), dark: material('#254460'),
    mint: material('#a4d9c5'), leaf: material('#a3cbb9'),
    orange: material('#ffb48d'), light: material('#ffe7cc', { emissive: '#ffb383', emissiveIntensity: .35 }),
  };
  const geometries = new Set(), materials = new Set(Object.values(m));
  function mesh(parent, geometry, mat, position) {
    geometries.add(geometry);
    const obj = new THREE.Mesh(geometry, mat);
    obj.position.set(...position); obj.castShadow = true; obj.receiveShadow = true;
    parent.add(obj); return obj;
  }
  function box(parent, size, pos, mat, radius = .06) {
    const r = Math.min(radius, ...size.map(n => n / 2));
    // rounding below ~0.012 units is invisible at this scale: plain boxes build and render much faster
    return mesh(parent, r < .012 ? new THREE.BoxGeometry(...size) : new RoundedBoxGeometry(...size, 3, r), mat, pos);
  }
  function ball(parent, radius, pos, mat, scale = [1,1,1]) {
    const obj = mesh(parent, new THREE.SphereGeometry(radius, 24, 16), mat, pos);
    obj.scale.set(...scale); return obj;
  }
  function rod(parent, a, b, radius, mat) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b);
    const obj = mesh(parent, new THREE.CylinderGeometry(radius, radius, start.distanceTo(end), 16), mat, start.clone().add(end).multiplyScalar(.5).toArray());
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), end.sub(start).normalize());
    return obj;
  }
  function path(points) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'catmullrom', .25);
    mesh(model, new THREE.TubeGeometry(curve, 90, .045, 10, false), m.orange, [0,0,0]);
    return curve;
  }
  function bolt(parent, pos, scale = 1, side = false) {
    const shape = new THREE.Shape();
    shape.moveTo(.07,.28); shape.lineTo(-.17,-.01); shape.lineTo(-.025,-.01);
    shape.lineTo(-.08,-.27); shape.lineTo(.18,.065); shape.lineTo(.025,.065); shape.closePath();
    const b = mesh(parent, new THREE.ExtrudeGeometry(shape, { depth: .025, bevelEnabled: true, bevelSegments: 2, bevelSize: .012, bevelThickness: .01 }), m.orange, pos);
    b.scale.setScalar(scale); if (side) b.rotation.y = Math.PI / 2;
  }
  function tree(x,z,scale = 1) {
    rod(model,[x,.13,z],[x,.62 * scale,z],.055,m.white);
    ball(model,.27 * scale,[x,.78 * scale,z],m.leaf,[.85,1.25,.9]);
    ball(model,.20 * scale,[x-.15*scale,.63*scale,z+.05],m.mint);
  }

  // A shared, softly beveled platform keeps the three illustrations a family.
  box(model,[6.7,.32,4.45],[0,-.16,0],m.base,.17);
  box(model,[6.6,.13,4.35],[0,.035,0],m.deck,.065);
  box(model,[1.05,.045,.045],[0,-.14,2.235],m.orange,.02);

  function solarArray(x,z,width,depth) {
    const group = new THREE.Group(); group.position.set(x,.14,z); model.add(group);
    for (const dx of [-width*.34,width*.34]) {
      box(group,[.18,.1,depth*.9],[dx,.05,0],m.white,.05);
      rod(group,[dx,.1,-depth*.35],[dx,.92,-depth*.35],.055,m.white);
      rod(group,[dx,.1,depth*.35],[dx,.38,depth*.35],.055,m.white);
    }
    const panel = new THREE.Group(); group.add(panel); panel.position.y = .72; panel.rotation.x = .32;
    box(panel,[width,.12,depth],[0,0,0],m.white,.06);
    const cols = width > 3 ? 12 : 6, rows = depth > 2 ? 7 : 5;
    const w = width-.16, d = depth-.16;
    box(panel,[w,.025,d],[0,.068,0],m.dark,.015);
    for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) {
      const px=-w/2+(c+.5)*w/cols, pz=-d/2+(r+.5)*d/rows;
      box(panel,[w/cols-.022,.014,d/rows-.022],[px,.089,pz],(c+r)%3 === 0 ? m.cell2 : m.cell,.017);
      box(panel,[.006,.004,d/rows-.03],[px,.099,pz],m.line,.002);
    }
    // Clear module breaks, in addition to the fine photovoltaic cell grid.
    if (cols===12) box(panel,[.045,.04,d],[0,.10,0],m.white,.01);
    box(panel,[w,.04,.045],[0,.10,0],m.white,.01);
    return group;
  }

  function batteryBank(x,z,count = 3,height = 2.6,unitWidth = 1.02) {
    const group = new THREE.Group(); group.position.set(x,.13,z); model.add(group);
    const width = count * unitWidth;
    box(group,[width+.2,.16,1.48],[0,.08,0],m.dark,.075);
    for (let i=0;i<count;i++) {
      const px=(i-(count-1)/2)*unitWidth;
      box(group,[unitWidth-.035,height,1.29],[px,height/2+.16,0],m.ice,.09);
      box(group,[unitWidth-.15,height-.28,.065],[px,height/2+.16,.657],m.white,.06);
      box(group,[unitWidth-.2,.13,1.22],[px,height+.19,0],m.white,.05);
      box(group,[.33,.16,.035],[px,height-.25,.699],m.dark,.03);
      for (let k=0;k<3;k++) box(group,[.065,.065,.012],[px-.09+k*.09,height-.25,.724],m.mint,.015);
      box(group,[.035,.24,.04],[px+unitWidth*.29,height*.58,.712],m.edge,.015);
      for (let k=0;k<5;k++) box(group,[unitWidth*.50,.027,.018],[px,.44+k*.075,.704],m.edge,.012);
      bolt(group,[px,height*.55,.712],.65);
    }
    box(group,[.04,.83,.68],[width/2+.005,height*.60,0],m.white,.08);
    bolt(group,[width/2+.035,height*.60,0],1.05,true);
    return group;
  }
  function gridPole(x,z,scale) {
    const group = new THREE.Group(); group.position.set(x,.14,z); group.scale.setScalar(scale); model.add(group);
    box(group,[.5,.15,.5],[0,.08,0],m.white,.07);
    rod(group,[0,.1,0],[0,2.5,0],.08,m.white);
    for (const [y,w] of [[2.22,1.1],[1.84,.85]]) {
      box(group,[w,.12,.15],[0,y,0],m.white,.05);
      for (const dx of [-w*.36,w*.36]) {
        box(group,[.13,.22,.14],[dx,y+.13,0],m.ice,.04);
        box(group,[.21,.045,.20],[dx,y+.15,0],m.mint,.02);
      }
    }
    ball(group,.09,[0,2.55,0],m.white);
    return group;
  }

  const routes = [], parts = {};
  if (product === 'solar') {
    // Panels occupy the hero area. The inverter is deliberately secondary.
    solarArray(-.40,-.15,4.65,2.9);
    box(model,[.62,.94,.52],[2.38,.60,.38],m.white,.09);
    box(model,[.39,.2,.035],[2.38,.78,.658],m.dark,.035);
    box(model,[.23,.045,.015],[2.38,.78,.683],m.mint,.014);
    for (let i=0;i<3;i++) box(model,[.31,.025,.02],[2.38,.36+i*.06,.66],m.edge,.01);
    routes.push(path([[-1.8,.15,1.42],[-1.8,.15,1.83],[-.5,.15,1.86],[1.7,.15,1.86],[2.38,.15,1.45],[2.38,.15,.67]]));
    tree(-2.8,-1.72,.82); tree(2.8,1.65,.55);
  } else if (product === 'hybrid') {
    // Equal visual weight: solar generation on the left, storage on the right.
    solarArray(-1.5,.05,2.7,2.65);
    batteryBank(1.40,-.35,2,2.18,.92);
    routes.push(path([[-1.8,.15,1.4],[-1.8,.15,1.86],[-.7,.15,1.91],[1.25,.15,1.91],[1.4,.15,1.15],[1.4,.15,.45]]));
    tree(-2.8,-1.75,.78); tree(2.8,1.65,.55);
  } else if (product === 'all') {
    // Landing page: all three products on one platform, joined by cables (solar → battery → grid).
    parts.solar = solarArray(-1.75,.25,2.45,2.35);
    parts.battery = batteryBank(.85,-.55,2,2.25,.9);
    parts.grid = gridPole(2.68,-1.4,.7);
    routes.push(path([[-1.75,.15,1.45],[-1.75,.15,1.86],[-.35,.15,1.92],[.85,.15,1.75],[.85,.15,.32]]));
    routes.push(path([[1.88,.15,-.5],[2.3,.15,-.55],[2.68,.15,-.85],[2.68,.15,-1.15]]));
    tree(-2.9,-1.75,.7); tree(2.85,1.7,.55);
  } else {
    // Storage is the unmistakable hero, with only a small grid connection behind it.
    batteryBank(-.28,-.12,3,2.75,1.05);
    gridPole(2.55,-1.1,.73);
    routes.push(path([[.9,.15,.64],[.9,.15,1.62],[1.9,.15,1.76],[2.68,.15,1.35],[2.68,.15,-.4],[2.55,.15,-.94]]));
    tree(-2.65,-1.6,.72); tree(-2.6,1.3,.52);
  }

  // Performance: the models are built from hundreds of small meshes (every solar cell is one). Merge every
  // static mesh that shares a material into one mesh per part, so a frame needs ~a dozen draw calls instead of
  // hundreds. Parts stay separate groups (the landing page lifts and dims them); sun, cloud and energy dots are
  // created after this and keep animating on their own.
  function mergeStatic(container) {
    container.updateMatrixWorld(true);
    const inv = container.matrixWorld.clone().invert(), byMat = new Map(), meshes = [];
    container.traverse(obj => {
      if (!obj.isMesh || obj === container) return;
      if (container === model) { let p = obj.parent; while (p && p !== model) { if (p.isGroup && p.parent === model) return; p = p.parent; } }
      meshes.push(obj);
      const g = obj.geometry.index ? obj.geometry.toNonIndexed() : obj.geometry.clone();
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, obj.matrixWorld));
      for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
      g.morphAttributes = {}; g.clearGroups();
      if (!byMat.has(obj.material)) byMat.set(obj.material, []);
      byMat.get(obj.material).push(g);
    });
    if (meshes.length < 2) return;
    meshes.forEach(m => { m.parent.remove(m); m.geometry.dispose(); geometries.delete(m.geometry); });
    container.traverse(obj => { if (obj.isGroup && obj !== container && obj.children.length === 0) obj.parent?.remove(obj); });
    for (const [mat, list] of byMat) {
      const merged = mergeGeometries(list, false); list.forEach(g => g.dispose());
      if (!merged) continue;
      geometries.add(merged);
      const mesh = new THREE.Mesh(merged, mat); mesh.castShadow = true; mesh.receiveShadow = true; container.add(mesh);
    }
  }
  model.children.filter(c => c.isGroup).forEach(mergeStatic);
  mergeStatic(model);

  const focus = Object.entries(parts).map(([key,group]) => {
    const bounds = new THREE.Box3().setFromObject(group), size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
    const mat = new THREE.MeshStandardMaterial({ color:'#ffb48d', emissive:'#ff9a66', emissiveIntensity:.7, transparent:true, opacity:0, roughness:.4 }); materials.add(mat);
    const ring = box(model,[size.x+.34,.03,size.z+.34],[center.x,.115,center.z],mat,.14); ring.castShadow = false;
    const own = new Map();
    group.traverse(obj => { if (!obj.isMesh) return; let c = own.get(obj.material); if (!c) { c = obj.material.clone(); c.userData.base = c.color.clone(); c.userData.baseEmissive = c.emissiveIntensity; own.set(obj.material, c); materials.add(c); } obj.material = c; });
    return { key, group, ring, mats: [...own.values()], baseY: group.position.y, lift: 0, glow: 0, dim: 0 };
  });
  let focusKeys = [];
  const viewTarget = { zoom: options.zoomHeight ?? 6.6, lookY: options.lookY ?? 1.05, scale: options.scale ?? 1 };
  const viewNow = { ...viewTarget };
  const DIM = new THREE.Color('#020409');
  const sun = ball(model,.23,[-2.35,3.15,-.65],m.orange);
  const cloud = new THREE.Group(); cloud.position.set(.30,3.48,-1.4); model.add(cloud);
  ball(cloud,.17,[-.20,0,0],m.white); ball(cloud,.24,[0,.07,0],m.white); ball(cloud,.16,[.21,0,0],m.white);
  const particles = routes.map(() => ball(model,.065,[0,0,0],m.light));

  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let motion = false, dragging = false, rotation = -.10, targetRotation = -.10;
  let rendered = false, compiled = false, startX = 0, startRotation = 0, visible = true, disposed = false, time = 0, raf = 0, last = performance.now();
  const events = [];
  function listen(target,event,handler) { target.addEventListener(event,handler); events.push(() => target.removeEventListener(event,handler)); }
  // autoFrame: measure the scene's real outline in camera space (across the idle-sway rotations)
  // so the camera can frame it with margins at any card size and never cut anything off.
  const outline = options.autoFrame ? (() => {
    camera.updateMatrixWorld(); const inv = camera.matrixWorldInverse, box = new THREE.Box3(), v = new THREE.Vector3();
    const out = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }, saved = model.rotation.y;
    for (const ry of [-0.5, -0.3, -0.1, 0.1, 0.25]) {
      model.rotation.y = ry; model.updateMatrixWorld(true);
      // each part's own box: a single box around everything would add empty corners and shrink the view
      model.traverse(mesh => {
        if (!mesh.isMesh) return;
        box.setFromObject(mesh);
        for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) {
          v.set(x, y, z).applyMatrix4(inv);
          out.minX = Math.min(out.minX, v.x); out.maxX = Math.max(out.maxX, v.x); out.minY = Math.min(out.minY, v.y); out.maxY = Math.max(out.maxY, v.y);
        }
      });
    }
    model.rotation.y = saved; model.updateMatrixWorld(true);
    return out;
  })() : null;
  function fit(width,height) {
    // refEl: the canvas covers the whole card, but the model keeps the size and position it had in the
    // card's 3D area (refEl), so anything that used to be clipped now spills into the card instead.
    const ref = options.refEl?.getBoundingClientRect?.(), cont = container.getBoundingClientRect();
    if (ref && ref.height > 0 && ref.width > 0 && cont.height > 0 && container.clientWidth > 0) {
      const k = cont.width / container.clientWidth;   // undo any CSS transform scale on the frame
      const rw = ref.width / k, rh = ref.height / k;
      const base = Math.max(viewNow.zoom, 9.4 * rh / rw), perPx = base / rh;
      const cy = (ref.top - cont.top) / k + rh / 2, cx = (ref.left - cont.left) / k + rw / 2 + (options.shiftX ?? 0) * rw / 2;
      camera.top = perPx * cy; camera.bottom = camera.top - perPx * height;
      camera.left = -perPx * cx; camera.right = camera.left + perPx * width;
      camera.updateProjectionMatrix(); return;
    }
    if (outline) {
      const m = options.autoFrame, s = viewNow.scale;
      let l = outline.minX, r = outline.maxX, t = outline.maxY, b = outline.minY;
      const w0 = r - l, h0 = t - b;
      l -= w0 * (m.side ?? .04); r += w0 * (m.side ?? .04); t += h0 * (m.top ?? .1); b -= h0 * (m.bottom ?? .05);
      // keep pixel bands clear at the top and bottom (the card's label and name sit over the canvas)
      const padTop = m.padTop ?? 0, padBottom = m.padBottom ?? 0, usable = Math.max(40, height - padTop - padBottom), aspect = width / usable;
      if ((r - l) / (t - b) < aspect) { const add = ((t - b) * aspect - (r - l)) / 2; l -= add; r += add; }
      else { const add = ((r - l) / aspect - (t - b)) / 2; t += add; b -= add; }
      const cx = (l + r) / 2, cy = (t + b) / 2; // scale 1 = fills the free area exactly; below 1 = more room around it
      l = cx + (l - cx) / s; r = cx + (r - cx) / s; t = cy + (t - cy) / s; b = cy + (b - cy) / s;
      const perPx = (t - b) / usable;
      camera.left = l; camera.right = r; camera.top = t + padTop * perPx; camera.bottom = b - padBottom * perPx;
      camera.updateProjectionMatrix(); return;
    }
    const viewHeight = Math.max(options.zoomHeight ?? 6.6,9.4*height/width);
    const halfW=viewHeight*width/height/2,shift=(options.shiftX??0)*halfW; camera.left=-halfW-shift; camera.right=halfW-shift;
    camera.top=viewHeight/2; camera.bottom=-camera.top; camera.updateProjectionMatrix();
  }
  function resize() {
    // layout size, not getBoundingClientRect: an entrance animation that scales the frame must not freeze the canvas smaller
    const width=container.clientWidth, height=container.clientHeight;
    if (width<=0 || height<=0) return;
    renderer.setSize(width,height); fit(width,height);
  }
  const observer = new ResizeObserver(resize); observer.observe(container); resize();
  const visibility = new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;}); visibility.observe(container);
  listen(container,'pointerdown',e=>{if(e.button!==0)return;dragging=true;options.sway=false;startX=e.clientX;startRotation=targetRotation;container.setPointerCapture(e.pointerId);});
  listen(container,'pointermove',e=>{if(dragging)targetRotation=startRotation+(e.clientX-startX)*.006;});
  for (const event of ['pointerup','pointercancel','lostpointercapture']) listen(container,event,()=>{dragging=false;});
  // Keyboard access is exposed on the viewport, independently of selection.
  listen(container,'keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();options.sway=false;targetRotation+=(e.key==='ArrowLeft'?-.15:.15);}if(e.key==='Home')targetRotation=-.10;});
  function frame(now) {
    if(disposed)return;
    const dt=Math.max(0,Math.min((now-last)/1000,.05)); last=now;
    if(visible&&!document.hidden) {
      if(motion&&!media.matches&&!dragging)time+=dt;
      // Idle sway shows the model is real 3D; dragging or the keyboard still take over.
      if(options.sway&&motion&&!media.matches&&!dragging)targetRotation=-.10+Math.sin(time*.375+(options.phase??0))*.32;
      rotation+=(targetRotation-rotation)*(media.matches?1:1-Math.exp(-10*dt));
      model.rotation.y=rotation;
      cloud.position.y=3.48+(motion&&!media.matches?Math.sin(time*.58)*.035:0);
      sun.position.y=3.15+(motion&&!media.matches?Math.sin(time*.67)*.025:0);
      const ease=media.matches?1:1-Math.exp(-7*dt);
      if(Math.abs(viewNow.scale-viewTarget.scale)>1e-3){const k=media.matches?1:1-Math.exp(-6*dt);viewNow.scale+=(viewTarget.scale-viewNow.scale)*k;resize();}
      if(!outline&&(Math.abs(viewNow.zoom-viewTarget.zoom)>1e-3||Math.abs(viewNow.lookY-viewTarget.lookY)>1e-3)){const k=media.matches?1:1-Math.exp(-6*dt);viewNow.zoom+=(viewTarget.zoom-viewNow.zoom)*k;viewNow.lookY+=(viewTarget.lookY-viewNow.lookY)*k;options.zoomHeight=viewNow.zoom;camera.lookAt(0,viewNow.lookY,0);resize();}
      focus.forEach(f=>{const on=focusKeys.includes(f.key),off=focusKeys.length>0&&!on;f.lift+=((on?.24:0)-f.lift)*ease;f.glow+=((on?.6:0)-f.glow)*ease;const lastDim=f.dim;f.dim+=((off?1:0)-f.dim)*ease;f.group.position.y=f.baseY+f.lift;f.ring.material.opacity=f.glow;if(Math.abs(f.dim-lastDim)>1e-4||f.dim===0&&lastDim!==0)f.mats.forEach(c=>{c.color.copy(c.userData.base).lerp(DIM,f.dim*.96);c.emissiveIntensity=c.userData.baseEmissive*(1-f.dim);});});
      particles.forEach((p,i)=>p.position.copy(routes[i].getPoint((time*.1+.3)%1)).add(new THREE.Vector3(0,.04,0)));
      // behind the login welcome screen and during its slide: show the first rendered frame, start moving afterwards
      if(compiled&&!(rendered&&(document.body.classList.contains('welcoming')||document.body.classList.contains('dashboard-in')))){renderer.render(scene,camera);rendered=true;}
    }
    raf=requestAnimationFrame(frame);
  }
  // compile shaders in the background (KHR_parallel_shader_compile) so the first frame never blocks the page
  const ready = (renderer.compileAsync ? renderer.compileAsync(scene, camera) : Promise.resolve()).catch(() => {}).then(() => { compiled = true; });
  raf=requestAnimationFrame(frame);
  return {
    ready,
    setMotion(on){motion=Boolean(on);},
    setFocus(keys=[]){focusKeys=[...keys];},
    // Glide the camera to a new zoom (smaller = closer) and look-at height.
    setView({zoom,lookY,scale}={}){if(zoom!=null)viewTarget.zoom=zoom;if(lookY!=null)viewTarget.lookY=lookY;if(scale!=null)viewTarget.scale=scale;},
    reset(){targetRotation=-.10;options.sway=Boolean(options.swayInitial??options.sway);},
    exportCanvas(width=1600,height=1200) {
      // Render and copy synchronously; no preserveDrawingBuffer needed.
      const oldSize=renderer.getSize(new THREE.Vector2()), ratio=renderer.getPixelRatio();
      try {
        renderer.setPixelRatio(1); renderer.setSize(width,height,false); fit(width,height);
        renderer.render(scene,camera);
        const output=document.createElement('canvas'); output.width=width;output.height=height;
        output.getContext('2d').drawImage(renderer.domElement,0,0);
        return output;
      } finally {
        renderer.setPixelRatio(ratio);renderer.setSize(oldSize.x,oldSize.y,false);fit(oldSize.x,oldSize.y);
        renderer.render(scene,camera);
      }
    },
    dispose(){
      if(disposed)return;disposed=true;cancelAnimationFrame(raf);
      observer.disconnect();visibility.disconnect();events.forEach(fn=>fn());
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
      renderer.dispose();renderer.domElement.remove();
    },
  };
}
