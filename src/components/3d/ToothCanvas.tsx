import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

export const ToothCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    const toothGroup = new THREE.Group();

    const loader = new FBXLoader();
    loader.load('/models/tooth.FBX', (model) => {
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.roughness = 0.25;
            child.material.metalness = 0.0;
          }
        }
      });
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 2.1;
      const scale = targetSize / maxDim;
      model.scale.set(scale, scale, scale);
      const scaledBox = new THREE.Box3().setFromObject(model);
      const center = scaledBox.getCenter(new THREE.Vector3());
      model.position.set(-center.x, -center.y, -center.z);
      toothGroup.add(model);
    }, undefined, (err) => {
      console.error('FBX load error:', err);
    });

    const ringRadius = 2.00;
    const ringTube = 0.02;
    const ringGeo = new THREE.TorusGeometry(ringRadius, ringTube, 32, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, opacity: 0.85, transparent: true });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, ringTube * 3, 32, 64),
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, opacity: 0.12, transparent: true })
    );
    glowRing.rotation.x = Math.PI / 3;
    toothGroup.add(glowRing);
    toothGroup.add(ringMesh);

    scene.add(toothGroup);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);
    const blueLight = new THREE.PointLight(0x3b82f6, 3, 10);
    blueLight.position.set(-4, -2, -2);
    scene.add(blueLight);
    const topSoftLight = new THREE.PointLight(0x60a5fa, 2, 10);
    topSoftLight.position.set(0, 5, 2);
    scene.add(topSoftLight);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Manual drag rotation (takes priority while the user is interacting)
    let isDragging = false;
    let lastInteractionAt = performance.now();
    let userRotY = 0;
    let userRotX = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragBaseRotY = 0;
    let dragBaseRotX = 0;

    const IDLE_AUTO_ROTATE_MS = 3000;
    const AUTO_SPIN_SPEED = 0.012;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      userRotY = toothGroup.rotation.y;
      userRotX = toothGroup.rotation.x;
      dragBaseRotY = userRotY;
      dragBaseRotX = userRotX;
      lastInteractionAt = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      userRotY = dragBaseRotY + (e.clientX - dragStartX) * 0.006;
      userRotX = THREE.MathUtils.clamp(dragBaseRotX + (e.clientY - dragStartY) * 0.004, -0.8, 0.8);
      lastInteractionAt = performance.now();
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      lastInteractionAt = performance.now();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const isIdle = performance.now() - lastInteractionAt > IDLE_AUTO_ROTATE_MS;

      ringMesh.rotation.z = elapsedTime * 0.2;
      glowRing.rotation.z = elapsedTime * 0.2;

      if (!isDragging && isIdle) {
        // Auto-rotate only when the tooth has been untouched for a few seconds
        toothGroup.rotation.y += AUTO_SPIN_SPEED;
        toothGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
        toothGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
      } else {
        toothGroup.rotation.y = userRotY;
        toothGroup.rotation.x = userRotX;
        toothGroup.position.y = 0;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing touch-none" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Interactive 3D Teeth
      </div>
    </div>
  );
};