/**
 * Presentation Component: Interactive 3D Digital Twin Viewport
 * Built with Three.js WebGL rendering for multi-modal physical AI twins.
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RobotModality } from '@/domain/kinematics/types';

interface DigitalTwin3DViewerProps {
  readonly modality: RobotModality;
  readonly robotId: string;
  readonly status: string;
}

export const DigitalTwin3DViewer: React.FC<DigitalTwin3DViewerProps> = ({
  modality,
  robotId,
  status,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0f172a'); // slate-900

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 280;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.8, 2.2, 3.2);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.5); // sky-400
    dirLight.position.set(3, 6, 4);
    scene.add(dirLight);

    // Ground Grid
    const grid = new THREE.GridHelper(6, 12, 0x3b82f6, 0x1e293b);
    scene.add(grid);

    // Procedural Modality Mesh Group
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    if (modality === 'bipedal_humanoid') {
      // Humanoid Biped: Torso, Head, Legs, ZMP Polygon
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.6, roughness: 0.3 });
      const jointMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
      
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.22), bodyMat);
      torso.position.y = 1.05;
      robotGroup.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), bodyMat);
      head.position.y = 1.48;
      robotGroup.add(head);

      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.7), jointMat);
      leftLeg.position.set(-0.12, 0.45, 0);
      robotGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.7), jointMat);
      rightLeg.position.set(0.12, 0.45, 0);
      robotGroup.add(rightLeg);

      // Dynamic ZMP Convex Support Polygon on floor
      const zmpGeo = new THREE.PlaneGeometry(0.55, 0.35);
      const zmpMat = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
      const zmpPlane = new THREE.Mesh(zmpGeo, zmpMat);
      zmpPlane.rotation.x = -Math.PI / 2;
      zmpPlane.position.y = 0.02;
      robotGroup.add(zmpPlane);
    } else if (modality === 'heavy_ackermann_hauler') {
      // 12-Ton Heavy Hauler with 12% inclined terrain wedge
      const haulerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 1.4), haulerMat);
      cabin.position.y = 0.6;
      robotGroup.add(cabin);

      [-0.5, 0.5].forEach((x) => {
        [-0.45, 0.45].forEach((z) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 16), wheelMat);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(x, 0.22, z);
          robotGroup.add(wheel);
        });
      });

      // 12% Incline Slope Plane
      const slopeGeo = new THREE.PlaneGeometry(3.0, 3.0);
      const slopeMat = new THREE.MeshBasicMaterial({ color: 0xb45309, wireframe: true });
      const slope = new THREE.Mesh(slopeGeo, slopeMat);
      slope.rotation.x = -Math.PI / 2 + 0.12; // 12% grade angle
      slope.position.y = 0.01;
      robotGroup.add(slope);
    } else if (modality === 'articulated_manipulator_arm') {
      // 6-DOF Manipulator with TCP Wrench vectors
      const armMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.7 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.15, 24), armMat);
      base.position.y = 0.075;
      robotGroup.add(base);

      const link1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6), armMat);
      link1.position.set(0, 0.4, 0);
      robotGroup.add(link1);

      const link2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5), armMat);
      link2.rotation.z = Math.PI / 4;
      link2.position.set(0.18, 0.75, 0);
      robotGroup.add(link2);

      // Contact Wrench Arrow (195N Spike)
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0.35, 0.95, 0),
        0.5,
        0xef4444
      );
      robotGroup.add(arrow);
    } else if (modality === 'urban_delivery_rover') {
      // Sidewalk Delivery Rover with Specular Sun Light
      const roverMat = new THREE.MeshStandardMaterial({ color: 0xa855f7 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.38, 0.8), roverMat);
      body.position.y = 0.32;
      robotGroup.add(body);

      // Sun Glare Cone
      const coneGeo = new THREE.ConeGeometry(0.4, 1.2, 16);
      const coneMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.35 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.rotation.x = Math.PI / 2;
      cone.position.set(0, 0.4, 0.8);
      robotGroup.add(cone);
    } else {
      // Wheeled Mobile AMR
      const amrMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.22, 32), amrMat);
      base.position.y = 0.18;
      robotGroup.add(base);

      const lidar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      lidar.position.y = 0.34;
      robotGroup.add(lidar);
    }

    // Interactive Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      robotGroup.rotation.y += 0.006;
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modality]);

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 card-shadow">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-300 mono flex items-center space-x-1.5 pointer-events-none">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-white">{robotId}</span>
        <span className="text-slate-500">|</span>
        <span>OpenUSD Twin Viewport</span>
      </div>
      <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 mono bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
        Status: <span className="text-blue-400 font-bold">{status}</span>
      </div>
    </div>
  );
};
