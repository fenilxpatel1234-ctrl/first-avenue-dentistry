import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ToothCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const width = currentMount.clientWidth || 400;
    const height = currentMount.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    const toothGroup = new THREE.Group();
    const crownGeo = new THREE.CylinderGeometry(1.2, 0.9, 1.8, 32, 16);
    const pos = crownGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      if (y > 0.4) {
        const factor = 1 + 0.15 * Math.sin(x * 3) * Math.cos(z * 3);
        pos.setX(i, x * factor);
        pos.setZ(i, z * factor);
      }
    }
    crownGeo.computeVertexNormals();

    const toothMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf5f0eb,
      roughness: 0.25,
      metalness: 0.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.15,
    });

    const crownMesh = new THREE.Mesh(crownGeo, toothMaterial);
    crownMesh.castShadow = true;
    crownMesh.receiveShadow = true;
    toothGroup.add(crownMesh);

    const root1Geo = new THREE.ConeGeometry(0.42, 2.2, 24);
    root1Geo.translate(-0.45, -1.8, 0);
    root1Geo.rotateZ(0.08);
    const root1Mesh = new THREE.Mesh(root1Geo, toothMaterial);
    toothGroup.add(root1Mesh);

    const root2Geo = new THREE.ConeGeometry(0.4, 2.2, 24);
    root2Geo.translate(0.45, -1.8, 0);
    root2Geo.rotateZ(-0.08);
    const root2Mesh = new THREE.Mesh(root2Geo, toothMaterial);
    toothGroup.add(root2Mesh);

    const ringGeo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, opacity: 0.4, transparent: true });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
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
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      toothGroup.rotation.y = elapsedTime * 0.4;
      toothGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
      toothGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
      ringMesh.rotation.z = elapsedTime * 0.2;
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
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Interactive 3D Porcelain Crown
      </div>
    </div>
  );
};
