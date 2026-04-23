import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ThreeBoxProps {
  isOpen: boolean;
  isRipping: boolean;
  isHidden: boolean;
  onClick: () => void;
}

// ─── Helper: draw QR-like pattern on a canvas context ───────────────────────
function drawQR(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cell = size / 9;
  const pattern = [
    [1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0],
    [1,0,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,1,1],
  ];
  ctx.fillStyle = '#1a1a2e';
  pattern.forEach((row, r) =>
    row.forEach((bit, c) => {
      if (bit) ctx.fillRect(x + c * cell, y + r * cell, cell - 0.5, cell - 0.5);
    })
  );
}

// ─── Helper: draw barcode lines ──────────────────────────────────────────────
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const bars = [3,1,2,1,3,2,1,2,1,3,1,2,2,1,3,1,2,1,1,2,3,1,2,1,3];
  let cx = x;
  let toggle = true;
  const total = bars.reduce((a, b) => a + b, 0);
  const scale = w / total;
  bars.forEach(b => {
    const bw = b * scale;
    if (toggle) { ctx.fillStyle = '#111'; ctx.fillRect(cx, y, bw - 0.5, h); }
    cx += bw;
    toggle = !toggle;
  });
}

// ─── Helper: create a shipping-label canvas texture ──────────────────────────
function makeShippingLabelTexture(): THREE.CanvasTexture {
  const W = 512, H = 512;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // Base: warm cardboard
  ctx.fillStyle = '#c8905a';
  ctx.fillRect(0, 0, W, H);

  // Corrugated lines (horizontal)
  ctx.strokeStyle = 'rgba(0,0,0,0.07)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < H; i += 8) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke();
  }

  // White label area
  const lx = 40, ly = 55, lw = 432, lh = 390;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(lx, ly, lw, lh, 10);
  ctx.fill();
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // FRAGILE stripe
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(lx, ly, lw, 28);
  ctx.fillStyle = '#7c2d12';
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚠  FRAGILE – HANDLE WITH CARE  ⚠', W / 2, ly + 19);

  // FROM / TO header divider
  const sectionY = ly + 42;
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(lx + 12, sectionY + 46); ctx.lineTo(lx + lw - 12, sectionY + 46); ctx.stroke();

  // FROM
  ctx.fillStyle = '#9ca3af';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('FROM', lx + 16, sectionY + 14);
  ctx.fillStyle = '#111';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('TrackMe Warehouse HQ', lx + 16, sectionY + 32);

  // TO
  ctx.fillStyle = '#9ca3af';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('TO', lx + 16, sectionY + 62);
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('John Doe', lx + 16, sectionY + 84);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText('123 Delivery Ave, Suite 4B', lx + 16, sectionY + 102);
  ctx.fillText('Mosinee, WI  54455  –  USA', lx + 16, sectionY + 118);

  // Divider
  ctx.strokeStyle = '#e5e7eb';
  ctx.beginPath(); ctx.moveTo(lx + 12, sectionY + 130); ctx.lineTo(lx + lw - 12, sectionY + 130); ctx.stroke();

  // QR code
  drawQR(ctx, lx + 16, sectionY + 142, 108);

  // Parcel ID & tracking
  ctx.fillStyle = '#111';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('#0201', lx + 140, sectionY + 172);
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px monospace';
  ctx.fillText('TRACKING ID', lx + 140, sectionY + 155);
  ctx.fillText('CR19 8129 3843 0053 5473 9', lx + 140, sectionY + 192);

  // Service level badge
  ctx.fillStyle = '#1e40af';
  ctx.beginPath(); ctx.roundRect(lx + 140, sectionY + 208, 88, 24, 6); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PRIORITY MAIL', lx + 184, sectionY + 224);

  // Weight / dims
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('WT: 2.4 kg   DIMS: 30×20×20 cm', lx + 140, sectionY + 250);

  // Barcode + number
  drawBarcode(ctx, lx + 16, sectionY + 270, lw - 32, 44);
  ctx.fillStyle = '#111';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('0201 9363 4651 8184 3943', W / 2, sectionY + 328);

  // Arrow decoration (handle with care)
  ctx.fillStyle = '#ef4444';
  const arrows = [lx + 18, lx + 60, lx + lw - 60, lx + lw - 18];
  arrows.forEach(ax => {
    ctx.beginPath();
    ctx.moveTo(ax, ly + lh - 24);
    ctx.lineTo(ax - 10, ly + lh - 8);
    ctx.lineTo(ax + 10, ly + lh - 8);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('THIS SIDE UP', W / 2, ly + lh - 8);

  return new THREE.CanvasTexture(canvas);
}

// ─── Helper: create a top/tape label texture ─────────────────────────────────
function makeTopLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c8905a';
  ctx.fillRect(0, 0, 256, 256);

  // Tape strip
  ctx.fillStyle = 'rgba(232,224,200,0.82)';
  ctx.fillRect(100, 0, 56, 256);

  // TRACKME logo on tape
  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#7c5a3c';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRACKME EXPRESS', 0, 4);
  ctx.restore();

  // Arrow "THIS WAY UP" on top face
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('↑ THIS SIDE UP ↑', 128, 40);
  ctx.fillText('↑ THIS SIDE UP ↑', 128, 220);

  return new THREE.CanvasTexture(canvas);
}

export default function ThreeBox({ isOpen, isRipping, isHidden, onClick }: ThreeBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef  = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef    = useRef<THREE.PerspectiveCamera | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef     = useRef<number>(0);

  const isOpenRef    = useRef(isOpen);
  const isRippingRef = useRef(isRipping);
  const isHiddenRef  = useRef(isHidden);

  useEffect(() => { isOpenRef.current = isOpen; },    [isOpen]);
  useEffect(() => { isRippingRef.current = isRipping; }, [isRipping]);
  useEffect(() => { isHiddenRef.current = isHidden; }, [isHidden]);

  const frontFlapRef = useRef<THREE.Group | null>(null);
  const backFlapRef  = useRef<THREE.Group | null>(null);
  const leftFlapRef  = useRef<THREE.Group | null>(null);
  const rightFlapRef = useRef<THREE.Group | null>(null);
  const tapeMesRef   = useRef<THREE.Mesh | null>(null);

  const raycaster = useRef(new THREE.Raycaster());
  const mouse     = useRef(new THREE.Vector2());

  const initThree = useCallback(() => {
    if (!containerRef.current) return;
    const width  = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan  = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.8;

    // Lighting
    scene.add(new THREE.AmbientLight(0xfff5e4, 0.8));
    const sun = new THREE.DirectionalLight(0xfff3d0, 1.8);
    sun.position.set(4, 8, 6);
    sun.castShadow = true;
    sun.shadow.camera.top = 3; sun.shadow.camera.bottom = -3;
    sun.shadow.camera.left = -3; sun.shadow.camera.right = 3;
    scene.add(sun);
    const fill = new THREE.PointLight(0xc8a87a, 0.6);
    fill.position.set(-4, -2, 3);
    scene.add(fill);

    // Ground shadow catcher
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.15 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Materials
    const cardMat = new THREE.MeshStandardMaterial({ color: 0xc7975c, roughness: 0.92, metalness: 0.0 });
    const cardDarkMat = new THREE.MeshStandardMaterial({ color: 0xa87845, roughness: 0.95, metalness: 0.0 });
    const interiorMat = new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 1.0 });

    // Label textures
    const labelTex = makeShippingLabelTexture();
    const topTex   = makeTopLabelTexture();

    const frontMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.85 });
    const topFlapMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.85 });

    // Box dimensions
    const W = 2.0, H = 1.4, D = 2.0, T = 0.05;
    const boxGroup = new THREE.Group();

    const addPanel = (geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number, rx = 0, ry = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, z);
      m.rotation.set(rx, ry, 0);
      m.castShadow = true;
      m.receiveShadow = true;
      boxGroup.add(m);
      return m;
    };

    addPanel(new THREE.BoxGeometry(W, T, D),         cardMat,     0,       -H/2 + T/2,  0);         // bottom
    addPanel(new THREE.BoxGeometry(W, H, T),         frontMat,    0,        0,           D/2 - T/2); // front (label)
    addPanel(new THREE.BoxGeometry(W, H, T),         cardDarkMat, 0,        0,         -(D/2 - T/2));// back
    addPanel(new THREE.BoxGeometry(T, H, D - T * 2), cardDarkMat, -(W/2 - T/2), 0,    0);           // left
    addPanel(new THREE.BoxGeometry(T, H, D - T * 2), cardMat,      W/2 - T/2,   0,    0);           // right

    // Interior floor
    const intMesh = new THREE.Mesh(new THREE.PlaneGeometry(W - T * 2, D - T * 2), interiorMat);
    intMesh.rotation.x = -Math.PI / 2;
    intMesh.position.y = -H/2 + T + 0.01;
    intMesh.receiveShadow = true;
    boxGroup.add(intMesh);

    // Flaps
    const makeFlap = (fW: number, fD: number, hx: number, hy: number, hz: number, ox: number, oz: number, mat: THREE.Material): THREE.Group => {
      const group = new THREE.Group();
      group.position.set(hx, hy, hz);
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(fW, T, fD), mat);
      mesh.position.set(ox, 0, oz);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      boxGroup.add(group);
      return group;
    };

    const hy = H/2 - T/2;
    const frontFlap = makeFlap(W,   D/2,      0,         hy,  D/2 - T/2, 0,          -(D/4 - T/2), topFlapMat);
    const backFlap  = makeFlap(W,   D/2,      0,         hy, -(D/2 - T/2), 0,          D/4 - T/2,  topFlapMat);
    const leftFlap  = makeFlap(W/2, D - T*2, -(W/2 - T/2), hy, 0,         W/4 - T/2,  0,           cardDarkMat);
    const rightFlap = makeFlap(W/2, D - T*2,  W/2 - T/2,   hy, 0,        -(W/4 - T/2), 0,           cardMat);

    frontFlapRef.current = frontFlap;
    backFlapRef.current  = backFlap;
    leftFlapRef.current  = leftFlap;
    rightFlapRef.current = rightFlap;

    // Tape strip (over seam)
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0xe8e0c8, transparent: true, opacity: 0.85, roughness: 0.5 });
    const tapeMes = new THREE.Mesh(new THREE.PlaneGeometry(0.42, D), tapeMat);
    tapeMes.rotation.x = -Math.PI / 2;
    tapeMes.position.y = H/2 + 0.015;
    boxGroup.add(tapeMes);
    tapeMesRef.current = tapeMes;

    // Initial orientation
    boxGroup.rotation.x = 0.38;
    boxGroup.rotation.y = -0.52;
    objectGroupRef.current = boxGroup;
    scene.add(boxGroup);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const grp = objectGroupRef.current;
      if (!grp) { controls.update(); renderer.render(scene, camera); return; }

      const opening = isOpenRef.current;
      const ripping = isRippingRef.current;
      const hidden  = isHiddenRef.current;
      const tape    = tapeMesRef.current;

      if (hidden) {
        grp.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), 0.12);
      } else if (opening) {
        const OPEN_X = Math.PI * 0.62;
        const OPEN_Z = Math.PI * 0.55;
        frontFlapRef.current!.rotation.x = THREE.MathUtils.lerp(frontFlapRef.current!.rotation.x, -OPEN_X, 0.06);
        backFlapRef.current!.rotation.x  = THREE.MathUtils.lerp(backFlapRef.current!.rotation.x,   OPEN_X, 0.06);
        leftFlapRef.current!.rotation.z  = THREE.MathUtils.lerp(leftFlapRef.current!.rotation.z,   OPEN_Z, 0.06);
        rightFlapRef.current!.rotation.z = THREE.MathUtils.lerp(rightFlapRef.current!.rotation.z, -OPEN_Z, 0.06);
        if (tape) (tape.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp((tape.material as THREE.MeshStandardMaterial).opacity, 0, 0.08);
        grp.rotation.x = THREE.MathUtils.lerp(grp.rotation.x, 0.55, 0.04);
        grp.position.y = Math.sin(t * 1.5) * 0.04;
        grp.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      } else if (ripping) {
        grp.position.x = (Math.random() - 0.5) * 0.08;
        grp.position.y = Math.sin(t * 30) * 0.06;
        if (tape) {
          tape.position.y += 0.025;
          tape.position.z += 0.04;
          tape.rotation.x -= 0.08;
          (tape.material as THREE.MeshStandardMaterial).opacity = Math.max(0, (tape.material as THREE.MeshStandardMaterial).opacity - 0.06);
        }
        frontFlapRef.current!.rotation.x = THREE.MathUtils.lerp(frontFlapRef.current!.rotation.x, -0.3, 0.05);
        backFlapRef.current!.rotation.x  = THREE.MathUtils.lerp(backFlapRef.current!.rotation.x,   0.3, 0.05);
        grp.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      } else {
        grp.position.x = THREE.MathUtils.lerp(grp.position.x, 0, 0.08);
        grp.position.y = Math.sin(t * 1.8) * 0.08;
        frontFlapRef.current!.rotation.x = THREE.MathUtils.lerp(frontFlapRef.current!.rotation.x, 0, 0.1);
        backFlapRef.current!.rotation.x  = THREE.MathUtils.lerp(backFlapRef.current!.rotation.x,  0, 0.1);
        leftFlapRef.current!.rotation.z  = THREE.MathUtils.lerp(leftFlapRef.current!.rotation.z,  0, 0.1);
        rightFlapRef.current!.rotation.z = THREE.MathUtils.lerp(rightFlapRef.current!.rotation.z, 0, 0.1);
        if (tape) {
          tape.position.y = H/2 + 0.015;
          tape.position.z = 0;
          tape.rotation.x = -Math.PI / 2;
          (tape.material as THREE.MeshStandardMaterial).opacity = 0.85;
        }
        grp.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const cw = containerRef.current.clientWidth;
      const ch = containerRef.current.clientHeight;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  useEffect(() => {
    const cleanup = initThree();
    return cleanup;
  }, [initThree]);

  useEffect(() => {
    const canvas = rendererRef.current?.domElement;
    if (!canvas) return;
    const getBoxMeshes = (): THREE.Object3D[] => {
      const grp = objectGroupRef.current;
      if (!grp) return [];
      const list: THREE.Object3D[] = [];
      grp.traverse(obj => { if ((obj as THREE.Mesh).isMesh) list.push(obj); });
      return list;
    };
    const toNDC = (ev: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x =  ((ev.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.current.y = -((ev.clientY - rect.top)  / rect.height) * 2 + 1;
    };
    const checkHit = (): boolean => {
      if (!cameraRef.current) return false;
      raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      return raycaster.current.intersectObjects(getBoxMeshes(), false).length > 0;
    };
    const handleClick = (ev: MouseEvent) => {
      if (isHiddenRef.current || isOpenRef.current || isRippingRef.current) return;
      toNDC(ev);
      if (checkHit()) onClick();
    };
    const handleMouseMove = (ev: MouseEvent) => {
      if (isHiddenRef.current || isOpenRef.current || isRippingRef.current) { canvas.style.cursor = 'default'; return; }
      toNDC(ev);
      canvas.style.cursor = checkHit() ? 'pointer' : 'default';
    };
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [onClick]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 2 }} />
  );
}
