/**
 * Presentation Component: Clean 3D Incident Flight Replay Viewport
 * 
 * Elegant, uncluttered "Black Box Reconstruction":
 * 1. Correct physical geometry and spatial alignment (Robot moves along +X axis)
 * 2. Clean single-line header with Unprotected vs Diffract Governor™ toggle
 * 3. Minimalist HUD (single status pill, no overlapping text clutter)
 * 4. Streamlined timeline scrubber with compact telemetry readout
 * 5. Full 3D Camera OrbitControls with preset viewports
 * 
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { RobotModality, OdometryPoint } from '@/domain/kinematics/types';

interface DigitalTwin3DViewerProps {
  readonly modality: RobotModality;
  readonly robotId: string;
  readonly status: string;
  readonly plannedPoints?: readonly OdometryPoint[];
  readonly actualPoints?: readonly OdometryPoint[];
  readonly hazardPoints?: readonly OdometryPoint[];
  readonly hazardLabel?: string;
}

export const DigitalTwin3DViewer: React.FC<DigitalTwin3DViewerProps> = ({
  modality,
  robotId,
  hazardLabel = 'Slick Wet Spill Zone (μ = 0.22)',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Flight Recorder Playback State
  const [currentTime, setCurrentTime] = useState<number>(2.4); // Default to incident moment
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [simulationMode, setSimulationMode] = useState<'baseline' | 'diffract'>('baseline');
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'chase'>('iso');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const safetyRingRef = useRef<THREE.Mesh | null>(null);
  const lidarPuckRef = useRef<THREE.Mesh | null>(null);
  const humanoidLimbsRef = useRef<{ leftLeg: THREE.Mesh; rightLeg: THREE.Mesh; torso: THREE.Mesh } | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);

  // Derived Telemetry Values
  const isSlickZone = currentTime >= 1.5;
  const currentFriction = isSlickZone ? 0.22 : 0.82;

  let speedDisplay = '1.6 m/s';
  let marginDisplay = '+1.20m';
  let slipDisplay = '3%';
  let statusBadge = { text: 'Nominal Corridor Tracking', isBreach: false };

  if (simulationMode === 'baseline') {
    if (currentTime < 1.5) {
      speedDisplay = '1.6 m/s';
      marginDisplay = `+${Math.max(0.1, (2.2 - currentTime * 1.1)).toFixed(2)}m`;
      slipDisplay = '3%';
      statusBadge = { text: 'Dry Corridor Approach (μ = 0.82)', isBreach: false };
    } else if (currentTime < 2.5) {
      speedDisplay = `${Math.max(0.4, 1.6 - (currentTime - 1.5) * 1.2).toFixed(1)} m/s`;
      marginDisplay = '-0.45m';
      slipDisplay = '38% (Skid)';
      statusBadge = { text: 'Spill Entry • Loss of Traction', isBreach: true };
    } else {
      speedDisplay = '0.0 m/s';
      marginDisplay = '-0.65m (Breach)';
      slipDisplay = 'Stopped (Overrun)';
      statusBadge = { text: 'Hazard Collision • ISO 3691-4 Failed', isBreach: true };
    }
  } else {
    // Diffract Governor™ Mode
    if (currentTime < 1.5) {
      speedDisplay = '1.6 m/s';
      marginDisplay = `+${Math.max(0.1, (2.2 - currentTime * 1.1)).toFixed(2)}m`;
      slipDisplay = '3%';
      statusBadge = { text: 'Dry Corridor Approach (μ = 0.82)', isBreach: false };
    } else if (currentTime < 2.7) {
      speedDisplay = `${Math.max(0.0, 1.6 - (currentTime - 1.5) * 1.35).toFixed(1)} m/s`;
      marginDisplay = `+${Math.max(0.65, 1.5 - (currentTime - 1.5) * 0.7).toFixed(2)}m`;
      slipDisplay = '5% (Controlled)';
      statusBadge = { text: 'Diffract Governor™ Braking Clamped', isBreach: false };
    } else {
      speedDisplay = '0.0 m/s';
      marginDisplay = '+0.75m Safe Cushion';
      slipDisplay = 'Clean Stop';
      statusBadge = { text: 'Safe Stop • ISO 3691-4 Certified', isBreach: false };
    }
  }

  // Kinematic Position Calculation
  // X = forward along corridor (-2.2 to +2.4)
  // Z = lateral drift (-0.5 to +0.5)
  // Y = vertical height
  const getPose = useCallback((t: number, mode: 'baseline' | 'diffract') => {
    let x = -2.2;
    let z = 0.0;
    let yaw = 0.0;

    if (mode === 'baseline') {
      if (t <= 1.5) {
        // Nominal approach
        x = -2.2 + (t / 1.5) * 2.2; // Moves from -2.2 to 0.0
        z = 0.0;
        yaw = 0.0;
      } else if (t <= 2.5) {
        // Skidding across slick spill (0.0 to 1.8)
        const alpha = (t - 1.5) / 1.0;
        x = 0.0 + alpha * 1.95; // Skids to X = 1.95
        z = alpha * 0.35; // Drifts laterally into obstacle
        yaw = alpha * 0.28; // Yaw slip of ~16 degrees
      } else {
        // Rest position (against hazard)
        x = 1.95;
        z = 0.35;
        yaw = 0.28;
      }
    } else {
      // Diffract Governor: straight-line controlled deceleration
      if (t <= 1.5) {
        x = -2.2 + (t / 1.5) * 2.2;
        z = 0.0;
        yaw = 0.0;
      } else if (t <= 2.7) {
        const alpha = (t - 1.5) / 1.2;
        // Ease-out deceleration
        const eased = 1 - Math.pow(1 - alpha, 2);
        x = 0.0 + eased * 1.45; // Stops at X = 1.45 (0.75m before obstacle at X = 2.2)
        z = 0.0;
        yaw = 0.0;
      } else {
        x = 1.45;
        z = 0.0;
        yaw = 0.0;
      }
    }

    return { x, z, yaw };
  }, []);

  // Update Three.js Object Transforms
  const updateSceneForTime = useCallback((t: number, mode: 'baseline' | 'diffract') => {
    const { x, z, yaw } = getPose(t, mode);

    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(x, 0, z);
      robotGroupRef.current.rotation.y = -yaw;
    }

    // Safety Stopping Ring on Ground
    if (safetyRingRef.current) {
      safetyRingRef.current.position.set(x + 0.3, 0.015, z);
      const mat = safetyRingRef.current.material as THREE.MeshBasicMaterial;
      if (mode === 'baseline') {
        if (t >= 1.5) {
          mat.color.setHex(0xe76f2e); // Orange/Red warning
          safetyRingRef.current.scale.set(1.3, 1.3, 1.0);
        } else {
          mat.color.setHex(0x2fa4d7);
          safetyRingRef.current.scale.set(1.0, 1.0, 1.0);
        }
      } else {
        mat.color.setHex(0x10b981); // Emerald safe
        safetyRingRef.current.scale.set(0.85, 0.85, 1.0);
      }
    }

    // Wheel Spin
    wheelsRef.current.forEach((wheel) => {
      if (t < 2.5 || (mode === 'diffract' && t < 2.7)) {
        wheel.rotation.z -= 0.12;
      }
    });

    // Humanoid Gait Animation
    if (humanoidLimbsRef.current) {
      const { leftLeg, rightLeg, torso } = humanoidLimbsRef.current;
      if (t < 1.5 || (mode === 'diffract' && t < 2.7)) {
        // Normal walking gait: legs swing forward & back along Z-rotation (in X-Y plane)
        const gait = Math.sin(t * 8.0) * 0.4;
        leftLeg.rotation.z = gait;
        rightLeg.rotation.z = -gait;
        torso.rotation.z = 0.02;
      } else if (mode === 'baseline') {
        // Slip: torso leans backward, feet slip forward
        torso.rotation.z = 0.35;
        leftLeg.rotation.z = -0.5;
        rightLeg.rotation.z = -0.3;
      } else {
        // Safe stop: upright balanced stance
        torso.rotation.z = 0.0;
        leftLeg.rotation.z = 0.0;
        rightLeg.rotation.z = 0.0;
      }
    }

    // LiDAR Sensor Puck Rotation
    if (lidarPuckRef.current) {
      lidarPuckRef.current.rotation.y += 0.08;
    }
  }, [getPose]);

  // Camera Presets
  const applyCameraPreset = (view: 'iso' | 'top' | 'chase') => {
    setCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;

    if (view === 'iso') {
      cameraRef.current.position.set(0.6, 2.6, 3.2);
      controlsRef.current.target.set(0.4, 0.3, 0.0);
    } else if (view === 'top') {
      cameraRef.current.position.set(0.4, 5.2, 0.01);
      controlsRef.current.target.set(0.4, 0.0, 0.0);
    } else if (view === 'chase') {
      cameraRef.current.position.set(-3.2, 1.2, 0.0);
      controlsRef.current.target.set(0.8, 0.3, 0.0);
    }
    controlsRef.current.update();
  };

  // Three.js Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1E1612'); // Clean espresso darkroom canvas
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 320;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0.6, 2.6, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10.0;
    controls.target.set(0.4, 0.3, 0.0);
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 5, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight(0x2fa4d7, 0.6);
    blueRimLight.position.set(-3, 2, -2);
    scene.add(blueRimLight);

    // ==========================================
    // 1. CLEAN GROUND SLAB & CORRIDOR MARKINGS
    // ==========================================
    const floorGeo = new THREE.PlaneGeometry(8, 3.6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x2A201A,
      roughness: 0.8,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Coordinate Grid
    const grid = new THREE.GridHelper(8, 16, 0x2fa4d7, 0x3E2C23);
    grid.position.y = 0.005;
    scene.add(grid);

    // Corridor Boundary Lines (Yellow)
    [-0.75, 0.75].forEach((zPos) => {
      const lineGeo = new THREE.PlaneGeometry(7.6, 0.05);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xF5E9D8, opacity: 0.4, transparent: true });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.008, zPos);
      scene.add(line);
    });

    // ==========================================
    // 2. SLICK CONTAMINATED SPILL ZONE (X: 0.0 to 1.8)
    // ==========================================
    const spillGeo = new THREE.PlaneGeometry(1.8, 1.3);
    const spillMat = new THREE.MeshStandardMaterial({
      color: 0x1B2832, // Dark blue-gray wet liquid
      roughness: 0.05,
      metalness: 0.7,
      transparent: true,
      opacity: 0.9,
    });
    const spill = new THREE.Mesh(spillGeo, spillMat);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(0.9, 0.012, 0.0);
    scene.add(spill);

    // Spill Boundary Dashes
    const spillOutlineGeo = new THREE.RingGeometry(0.85, 0.88, 4);
    const spillOutlineMat = new THREE.MeshBasicMaterial({ color: 0xE76F2E, side: THREE.DoubleSide });
    const spillOutline = new THREE.Mesh(spillOutlineGeo, spillOutlineMat);
    spillOutline.rotation.x = -Math.PI / 2;
    spillOutline.scale.set(1.1, 0.78, 1);
    spillOutline.position.set(0.9, 0.014, 0.0);
    scene.add(spillOutline);

    // ==========================================
    // 3. COLLISION HAZARD OBSTACLE (X: 2.2, Z: 0.0)
    // ==========================================
    const obstacleGroup = new THREE.Group();
    obstacleGroup.position.set(2.2, 0, 0);

    // Wooden Pallet Base
    const palletGeo = new THREE.BoxGeometry(0.65, 0.1, 0.75);
    const palletMat = new THREE.MeshStandardMaterial({ color: 0x825E3E, roughness: 0.9 });
    const pallet = new THREE.Mesh(palletGeo, palletMat);
    pallet.position.y = 0.05;
    pallet.castShadow = true;
    obstacleGroup.add(pallet);

    // Orange Safety Cargo Crate
    const crateGeo = new THREE.BoxGeometry(0.55, 0.55, 0.65);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xE76F2E, roughness: 0.4 });
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.y = 0.375;
    crate.castShadow = true;
    obstacleGroup.add(crate);

    // Warning Strobe Beacon on Crate
    const beaconGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xFF2200 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 0.69, 0);
    obstacleGroup.add(beacon);

    scene.add(obstacleGroup);

    // ==========================================
    // 4. TRAJECTORY PATH GUIDES
    // ==========================================
    // Green Nominal Path
    const nomPoints = [new THREE.Vector3(-2.2, 0.02, 0), new THREE.Vector3(2.0, 0.02, 0)];
    const nomGeo = new THREE.BufferGeometry().setFromPoints(nomPoints);
    const nomLine = new THREE.Line(nomGeo, new THREE.LineBasicMaterial({ color: 0x10B981, transparent: true, opacity: 0.7 }));
    scene.add(nomLine);

    // Red Skid Deviation Path
    const skidPoints = [
      new THREE.Vector3(0.0, 0.022, 0),
      new THREE.Vector3(0.8, 0.022, 0.12),
      new THREE.Vector3(1.5, 0.022, 0.28),
      new THREE.Vector3(1.95, 0.022, 0.35),
    ];
    const skidGeo = new THREE.BufferGeometry().setFromPoints(skidPoints);
    const skidMat = new THREE.LineDashedMaterial({ color: 0xEF4444, dashSize: 0.1, gapSize: 0.05 });
    const skidLine = new THREE.Line(skidGeo, skidMat);
    skidLine.computeLineDistances();
    scene.add(skidLine);

    // Safety Stopping Ring
    const ringGeo = new THREE.RingGeometry(0.35, 0.4, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x2FA4D7, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const safetyRing = new THREE.Mesh(ringGeo, ringMat);
    safetyRing.rotation.x = -Math.PI / 2;
    scene.add(safetyRing);
    safetyRingRef.current = safetyRing;

    // ==========================================
    // 5. ROBOT MODEL ASSEMBLY
    // ==========================================
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    wheelsRef.current = [];
    humanoidLimbsRef.current = null;

    if (modality === 'bipedal_humanoid') {
      // Bipedal Humanoid (Standing along Y, Walking along +X)
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2FA4D7, metalness: 0.5, roughness: 0.3 });
      const jointMat = new THREE.MeshStandardMaterial({ color: 0x3E2C23, roughness: 0.6 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.3), bodyMat);
      torso.position.y = 0.85;
      torso.castShadow = true;
      robotGroup.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), bodyMat);
      head.position.y = 1.18;
      robotGroup.add(head);

      // Legs: Left at Z = -0.1, Right at Z = +0.1
      const legGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.55);
      const leftLeg = new THREE.Mesh(legGeo, jointMat);
      leftLeg.position.set(0, 0.35, -0.1);
      robotGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, jointMat);
      rightLeg.position.set(0, 0.35, 0.1);
      robotGroup.add(rightLeg);

      humanoidLimbsRef.current = { leftLeg, rightLeg, torso };
    } else if (modality === 'heavy_ackermann_hauler') {
      // Heavy Hauler (Length along X: 1.3, Width along Z: 0.7)
      const cabMat = new THREE.MeshStandardMaterial({ color: 0xE76F2E, roughness: 0.4 });
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x3E2C23, roughness: 0.6 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x181818 });

      // Cab (Front at +X)
      const cab = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 0.65), cabMat);
      cab.position.set(0.35, 0.45, 0);
      cab.castShadow = true;
      robotGroup.add(cab);

      // Haul Bed (Rear at -X)
      const bed = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.35, 0.7), bedMat);
      bed.position.set(-0.25, 0.4, 0);
      bed.castShadow = true;
      robotGroup.add(bed);

      // 4 Wheels (Axles along Z, Rolling along X)
      const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
      [-0.4, 0.35].forEach((xPos) => {
        [-0.4, 0.4].forEach((zPos) => {
          const wheel = new THREE.Mesh(wheelGeo, wheelMat);
          wheel.rotation.x = Math.PI / 2; // Lie flat sideways
          wheel.position.set(xPos, 0.18, zPos);
          wheel.castShadow = true;
          robotGroup.add(wheel);
          wheelsRef.current.push(wheel);
        });
      });
    } else {
      // Wheeled Mobile AMR (Default)
      // Length along X: 0.7, Width along Z: 0.48, Height: 0.22
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2FA4D7, metalness: 0.5, roughness: 0.3 });
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x3E2C23, roughness: 0.7 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x181818 });

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.46), bodyMat);
      chassis.position.y = 0.16;
      chassis.castShadow = true;
      robotGroup.add(chassis);

      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.04, 0.42), deckMat);
      deck.position.y = 0.27;
      robotGroup.add(deck);

      // LiDAR Puck (Front-center)
      const lidarPuck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      lidarPuck.position.set(0.18, 0.33, 0);
      robotGroup.add(lidarPuck);
      lidarPuckRef.current = lidarPuck;

      // 4 Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
      [-0.22, 0.22].forEach((xPos) => {
        [-0.24, 0.24].forEach((zPos) => {
          const wheel = new THREE.Mesh(wheelGeo, wheelMat);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(xPos, 0.09, zPos);
          robotGroup.add(wheel);
          wheelsRef.current.push(wheel);
        });
      });
    }

    // Initial position
    updateSceneForTime(currentTime, simulationMode);

    // Animation Loop
    let animId: number;
    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modality]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Playback Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.04 * playbackSpeed;
          if (next >= 4.0) {
            setIsPlaying(false);
            return 4.0;
          }
          return parseFloat(next.toFixed(2));
        });
      }, 40);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // Sync transforms on time or mode change
  useEffect(() => {
    updateSceneForTime(currentTime, simulationMode);
  }, [currentTime, simulationMode, updateSceneForTime]);

  return (
    <div className="rounded-2xl bg-[#3E2C23] border border-[#3E2C23] overflow-hidden text-[#F5E9D8] shadow-lg flex flex-col">
      {/* 1. Sleek Single-Line Header Bar */}
      <div className="px-4 py-2.5 bg-[#2A1D17] border-b border-[#F5E9D8]/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#2FA4D7]" />
          <span className="text-xs font-bold text-white tracking-wide font-mono">
            Diffract Studio™ // 3D Incident Flight Replay
          </span>
          <span className="text-[11px] text-[#F5E9D8]/60 font-mono hidden sm:inline">
            ({robotId})
          </span>
        </div>

        {/* Clean 2-Option Segmented Control */}
        <div className="inline-flex items-center bg-[#1A120E] p-0.5 rounded-lg border border-[#F5E9D8]/15 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSimulationMode('baseline')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              simulationMode === 'baseline'
                ? 'bg-[#E76F2E] text-white font-bold shadow-xs'
                : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Unprotected Incident</span>
          </button>
          <button
            type="button"
            onClick={() => setSimulationMode('diffract')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
              simulationMode === 'diffract'
                ? 'bg-[#2FA4D7] text-white font-bold shadow-xs'
                : 'text-[#F5E9D8]/70 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Diffract Governor™ (Patched)</span>
          </button>
        </div>
      </div>

      {/* 2. Uncluttered 3D Viewport */}
      <div className="relative w-full h-72 sm:h-80 bg-[#1E1612] overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Single Status Pill in Top-Right Corner */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          <div
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-md ${
              statusBadge.isBreach
                ? 'bg-[#E76F2E] text-white border-white/20'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <span>{statusBadge.text}</span>
          </div>
        </div>

        {/* Small Camera Buttons in Bottom-Right Corner */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center bg-[#2A1D17]/80 backdrop-blur-xs p-0.5 rounded-md border border-[#F5E9D8]/15 space-x-1 text-[10px] font-mono">
          {(['iso', 'top', 'chase'] as const).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => applyCameraPreset(view)}
              className={`px-2 py-0.5 rounded transition-colors uppercase ${
                cameraView === view ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/60 hover:text-white'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Compact Timeline Scrubber & Minimalist Telemetry Bar */}
      <div className="p-3 bg-[#2A1D17] border-t border-[#F5E9D8]/10 space-y-2">
        {/* Playback Controls & Slider */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentTime(0.0);
            }}
            className="w-8 h-8 rounded-lg bg-[#1A120E] hover:bg-black text-[#F5E9D8]/70 hover:text-white border border-[#F5E9D8]/15 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            title="Rewind to 0.0s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Slider */}
          <div className="flex-1 flex items-center space-x-2">
            <input
              type="range"
              min="0.0"
              max="4.0"
              step="0.02"
              value={currentTime}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentTime(parseFloat(e.target.value));
              }}
              className="w-full accent-[#2FA4D7] cursor-pointer"
              aria-label="Timeline Scrubber"
            />
            <span className="text-xs font-mono text-white shrink-0 w-12 text-right">
              {currentTime.toFixed(2)}s
            </span>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center space-x-0.5 shrink-0 bg-[#1A120E] p-0.5 rounded border border-[#F5E9D8]/15 text-[10px] font-mono">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  playbackSpeed === s ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/60 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Clean, Non-Cluttered Telemetry Ribbon (Single Row) */}
        <div className="pt-2 border-t border-[#F5E9D8]/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Speed:</span>
            <span className="font-bold text-white">{speedDisplay}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Friction:</span>
            <span className={`font-bold ${isSlickZone ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
              μ = {currentFriction.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Margin:</span>
            <span className={`font-bold ${marginDisplay.includes('-') ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
              {marginDisplay}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Traction:</span>
            <span className={`font-bold ${slipDisplay.includes('Skid') ? 'text-[#E76F2E]' : 'text-white'}`}>
              {slipDisplay}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
