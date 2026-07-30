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
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const ringGeo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, opacity: 0.4, transparent: true });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    group.add(ringMesh);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/tooth-model.png');
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      sizeAttenuation: false
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(3.8, 3.8, 1);
    sprite.position.set(0, 0, 0);
    group.add(sprite);

    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    let animationFrameId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      group.rotation.y = elapsedTime * 0.4;
      group.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.15;
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
        Interactive 3D Teeth
      </div>
    </div>
  );
};