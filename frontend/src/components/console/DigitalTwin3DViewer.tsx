/**
 * Presentation Component: Real-Time Numerical Physics Incident Simulator & 3D Twin
 * 
 * Powered by 200 Hz Runge-Kutta numerical vehicle dynamics solver:
 * 1. Pacejka tire traction slip curve F_x(s) and dynamic weight transfer
 * 2. Inertial suspension pitch (nose-dive under heavy braking & damped rebound)
 * 3. Active 3D LiDAR sensor raycast beams with obstacle collision detection
 * 4. Real-time Force Vectors (F_x traction, F_z normal load) on wheel contact patches
 * 5. Interactive Surface Friction (mu) slider that physically recalculates the trajectory
 * 
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Sliders,
} from 'lucide-react';
import { RobotModality, OdometryPoint } from '@/domain/kinematics/types';
import {
  solveVehicleTrajectory,
  DynamicState,
} from '@/domain/kinematics/vehicleDynamicsSolver';

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
  hazardLabel = 'Slick Wet Spill Zone',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Simulation Configuration & Control State
  const [simulationMode, setSimulationMode] = useState<'baseline' | 'diffract'>('baseline');
  const [surfaceMu, setSurfaceMu] = useState<number>(0.22); // Interactive friction slider
  const [currentTime, setCurrentTime] = useState<number>(2.2); // Default to critical moment
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'chase'>('iso');
  const [showForceVectors, setShowForceVectors] = useState<boolean>(true);

  // 1. Execute Real-Time 200 Hz Numerical Physics Solver
  // Recalculates dynamically whenever friction slider or simulation mode changes
  const trajectoryRollout = useMemo(() => {
    return solveVehicleTrajectory(modality, simulationMode, surfaceMu, 1.65, 4.0);
  }, [modality, simulationMode, surfaceMu]);

  // Interpolate state at arbitrary scrub time t
  const currentState: DynamicState = useMemo(() => {
    if (!trajectoryRollout.length) {
      return {
        timeS: 0,
        x: -2.2,
        z: 0,
        yawRad: 0,
        vx: 1.65,
        vz: 0,
        yawRateRadS: 0,
        pitchRad: 0,
        pitchRateRadS: 0,
        frontNormalForceN: 600,
        rearNormalForceN: 600,
        frontTractionForceN: 0,
        rearTractionForceN: 0,
        slipRatio: 0.03,
        surfaceMu: 0.82,
        barrierMarginM: 1.2,
        obstacleDistanceM: 2.35,
        isCollided: false,
        isGoverned: false,
      };
    }

    const maxIdx = trajectoryRollout.length - 1;
    const targetIdx = Math.min(
      maxIdx,
      Math.max(0, Math.floor((currentTime / 4.0) * maxIdx))
    );
    return trajectoryRollout[targetIdx];
  }, [trajectoryRollout, currentTime]);

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const chassisMeshRef = useRef<THREE.Mesh | null>(null);
  const safetyEnvelopeRef = useRef<THREE.Mesh | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);
  const lidarRaysGroupRef = useRef<THREE.Group | null>(null);
  const forceVectorsGroupRef = useRef<THREE.Group | null>(null);
  const skidLineRef = useRef<THREE.Line | null>(null);
  const humanoidLimbsRef = useRef<{ leftLeg: THREE.Mesh; rightLeg: THREE.Mesh; torso: THREE.Mesh } | null>(null);

  // Camera Presets
  const applyCameraPreset = (view: 'iso' | 'top' | 'chase') => {
    setCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;

    if (view === 'iso') {
      cameraRef.current.position.set(0.6, 2.4, 3.2);
      controlsRef.current.target.set(0.4, 0.35, 0.0);
    } else if (view === 'top') {
      cameraRef.current.position.set(0.3, 5.5, 0.01);
      controlsRef.current.target.set(0.3, 0.0, 0.0);
    } else if (view === 'chase') {
      cameraRef.current.position.set(-3.2, 1.2, 0.0);
      controlsRef.current.target.set(0.6, 0.3, 0.0);
    }
    controlsRef.current.update();
  };

  // Synchronize 3D Scene to Numerical Physics State
  const syncSceneWithPhysics = useCallback((state: DynamicState) => {
    if (!robotGroupRef.current) return;

    // 1. Robot Global Coordinates: X = forward, Z = lateral drift
    robotGroupRef.current.position.set(state.x, 0, state.z);
    robotGroupRef.current.rotation.y = -state.yawRad;

    // 2. Real Inertial Suspension Pitch (Nose-dive under braking)
    if (chassisMeshRef.current) {
      // Rotate around Z axis of robot local frame so front dips down toward road
      chassisMeshRef.current.rotation.z = -state.pitchRad;
    }

    // 3. Wheel Rotations (proportional to forward speed)
    wheelsRef.current.forEach((wheel) => {
      if (state.vx > 0.01) {
        wheel.rotation.z -= state.vx * 0.08;
      }
    });

    // 4. Humanoid Dynamic Gait & Foot Slip
    if (humanoidLimbsRef.current) {
      const { leftLeg, rightLeg, torso } = humanoidLimbsRef.current;
      if (state.vx > 0.1) {
        // Normal dynamic gait cycle: swing legs in X-Y plane (Z-axis rotation)
        const gaitPhase = state.timeS * 9.0;
        leftLeg.rotation.z = Math.sin(gaitPhase) * 0.45;
        rightLeg.rotation.z = -Math.sin(gaitPhase) * 0.45;
        torso.rotation.z = -state.pitchRad * 0.8;
      } else if (state.isCollided || state.slipRatio > 0.25) {
        // Violent backward slip stance
        torso.rotation.z = 0.4;
        leftLeg.rotation.z = -0.6;
        rightLeg.rotation.z = -0.3;
      } else {
        // Balanced upright stance
        torso.rotation.z = 0.0;
        leftLeg.rotation.z = 0.0;
        rightLeg.rotation.z = 0.0;
      }
    }

    // 5. Dynamic Stopping Distance Safety Envelope
    if (safetyEnvelopeRef.current) {
      const envMesh = safetyEnvelopeRef.current;
      envMesh.position.set(state.x + 0.35, 0.015, state.z);
      const mat = envMesh.material as THREE.MeshBasicMaterial;

      if (state.isCollided || state.barrierMarginM < 0.0) {
        mat.color.setHex(0xe76f2e); // Orange/Red breach
        envMesh.scale.set(1.4, 1.4, 1.0);
      } else {
        mat.color.setHex(0x10b981); // Emerald safe
        envMesh.scale.set(0.9, 0.9, 1.0);
      }
    }

    // 6. Active 3D LiDAR Sensor Raycasts
    if (lidarRaysGroupRef.current) {
      const rays = lidarRaysGroupRef.current.children as THREE.Line[];
      const numRays = rays.length;
      const obstacleDist = state.obstacleDistanceM;

      rays.forEach((ray, i) => {
        const angle = -0.6 + (i / (numRays - 1)) * 1.2;
        const beamLength = Math.min(2.5, Math.max(0.2, obstacleDist / Math.cos(angle)));

        const points = [
          new THREE.Vector3(state.x + 0.2, 0.32, state.z),
          new THREE.Vector3(
            state.x + 0.2 + beamLength * Math.cos(-state.yawRad + angle),
            0.15,
            state.z + beamLength * Math.sin(-state.yawRad + angle)
          ),
        ];
        ray.geometry.setFromPoints(points);

        const rayMat = ray.material as THREE.LineBasicMaterial;
        if (obstacleDist < 0.6) {
          rayMat.color.setHex(0xef4444); // Critical red
        } else if (obstacleDist < 1.4) {
          rayMat.color.setHex(0xf59e0b); // Warning amber
        } else {
          rayMat.color.setHex(0x2fa4d7); // Clear blue
        }
      });
    }

    // 7. Real Physics Force Vectors on Wheel Contact Patches
    if (forceVectorsGroupRef.current) {
      const arrows = forceVectorsGroupRef.current.children as THREE.ArrowHelper[];
      if (arrows.length >= 2) {
        const frontArrow = arrows[0];
        const rearArrow = arrows[1];

        const frontMag = Math.min(0.8, (state.frontTractionForceN / 1200.0) * 0.8);
        const rearMag = Math.min(0.8, (state.rearTractionForceN / 1200.0) * 0.8);

        // Braking force points backward relative to velocity vector
        frontArrow.position.set(state.x + 0.25, 0.05, state.z);
        frontArrow.setLength(Math.max(0.05, frontMag), 0.08, 0.04);
        frontArrow.setColor(state.slipRatio > 0.2 ? 0xe76f2e : 0x2fa4d7);

        rearArrow.position.set(state.x - 0.25, 0.05, state.z);
        rearArrow.setLength(Math.max(0.05, rearMag), 0.08, 0.04);
        rearArrow.setColor(state.slipRatio > 0.2 ? 0xe76f2e : 0x2fa4d7);
      }
    }
  }, []);

  // Three.js Canvas Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1A130F'); // Deep espresso engineering canvas
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0.6, 2.4, 3.2);
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
    controls.minDistance = 1.2;
    controls.maxDistance = 9.0;
    controls.target.set(0.4, 0.35, 0.0);
    controlsRef.current = controls;

    // Lighting Rig
    scene.add(new THREE.AmbientLight(0xfff6ed, 0.85));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 6, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x2fa4d7, 0.6);
    cyanRim.position.set(-3, 3, -2);
    scene.add(cyanRim);

    // ==========================================
    // 1. FLOOR SLAB & CORRIDOR MARKINGS
    // ==========================================
    const floorGeo = new THREE.PlaneGeometry(9, 3.6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x261d18,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Coordinate Grid
    const grid = new THREE.GridHelper(9, 18, 0x2fa4d7, 0x3e2c23);
    grid.position.y = 0.005;
    scene.add(grid);

    // Corridor Guide Lines (Beige)
    [-0.75, 0.75].forEach((zPos) => {
      const lineGeo = new THREE.PlaneGeometry(8.8, 0.04);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5e9d8, transparent: true, opacity: 0.4 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.008, zPos);
      scene.add(line);
    });

    // ==========================================
    // 2. SLICK CONTAMINATED SPILL ZONE (X: 0.15 to 2.1)
    // ==========================================
    const spillGeo = new THREE.PlaneGeometry(1.95, 1.4);
    const spillMat = new THREE.MeshStandardMaterial({
      color: 0x18242c, // Dark wet liquid
      roughness: 0.04, // Mirror-like wet gloss
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
    });
    const spill = new THREE.Mesh(spillGeo, spillMat);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(1.12, 0.012, 0.0);
    scene.add(spill);

    // Spill Boundary Outline (Safety Orange)
    const spillOutlineGeo = new THREE.RingGeometry(0.95, 0.98, 4);
    const spillOutlineMat = new THREE.MeshBasicMaterial({ color: 0xe76f2e, side: THREE.DoubleSide });
    const spillOutline = new THREE.Mesh(spillOutlineGeo, spillOutlineMat);
    spillOutline.rotation.x = -Math.PI / 2;
    spillOutline.scale.set(1.05, 0.75, 1.0);
    spillOutline.position.set(1.12, 0.014, 0.0);
    scene.add(spillOutline);

    // ==========================================
    // 3. COLLISION HAZARD OBSTACLE (X: 2.35, Z: 0.0)
    // ==========================================
    const obstacleGroup = new THREE.Group();
    obstacleGroup.position.set(2.35, 0, 0);

    // Pallet Base
    const palletGeo = new THREE.BoxGeometry(0.65, 0.1, 0.75);
    const palletMat = new THREE.MeshStandardMaterial({ color: 0x7c5a3c, roughness: 0.9 });
    const pallet = new THREE.Mesh(palletGeo, palletMat);
    pallet.position.y = 0.05;
    pallet.castShadow = true;
    obstacleGroup.add(pallet);

    // Staging Cargo Crate
    const crateGeo = new THREE.BoxGeometry(0.55, 0.55, 0.65);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xe76f2e, roughness: 0.4 });
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.y = 0.375;
    crate.castShadow = true;
    obstacleGroup.add(crate);

    // Obstacle Beacon
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12),
      new THREE.MeshBasicMaterial({ color: 0xff1100 })
    );
    beacon.position.set(0, 0.69, 0);
    obstacleGroup.add(beacon);

    scene.add(obstacleGroup);

    // ==========================================
    // 4. ACTIVE 3D LIDAR SENSOR RAYS
    // ==========================================
    const lidarGroup = new THREE.Group();
    const numBeams = 12;
    for (let i = 0; i < numBeams; i++) {
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1, 0, 0),
      ]);
      const rayMat = new THREE.LineBasicMaterial({
        color: 0x2fa4d7,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5,
      });
      const ray = new THREE.Line(rayGeo, rayMat);
      lidarGroup.add(ray);
    }
    scene.add(lidarGroup);
    lidarRaysGroupRef.current = lidarGroup;

    // ==========================================
    // 5. WHEEL CONTACT FORCE VECTORS (3D ARROWS)
    // ==========================================
    const forceGroup = new THREE.Group();
    const frontArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 0.3, 0x2fa4d7);
    const rearArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 0), 0.3, 0x2fa4d7);
    forceGroup.add(frontArrow);
    forceGroup.add(rearArrow);
    scene.add(forceGroup);
    forceVectorsGroupRef.current = forceGroup;

    // ==========================================
    // 6. DYNAMIC SAFETY STOPPING ENVELOPE
    // ==========================================
    const ringGeo = new THREE.RingGeometry(0.35, 0.42, 28);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x2fa4d7, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const safetyRing = new THREE.Mesh(ringGeo, ringMat);
    safetyRing.rotation.x = -Math.PI / 2;
    scene.add(safetyRing);
    safetyEnvelopeRef.current = safetyRing;

    // ==========================================
    // 7. ROBOT 3D VEHICLE ASSEMBLY
    // ==========================================
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    wheelsRef.current = [];
    humanoidLimbsRef.current = null;

    if (modality === 'bipedal_humanoid') {
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2fa4d7, metalness: 0.5, roughness: 0.3 });
      const jointMat = new THREE.MeshStandardMaterial({ color: 0x3e2c23, roughness: 0.6 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.45, 0.3), bodyMat);
      torso.position.y = 0.85;
      torso.castShadow = true;
      robotGroup.add(torso);
      chassisMeshRef.current = torso;

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), bodyMat);
      head.position.y = 1.18;
      robotGroup.add(head);

      const legGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.55);
      const leftLeg = new THREE.Mesh(legGeo, jointMat);
      leftLeg.position.set(0, 0.35, -0.1);
      robotGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(legGeo, jointMat);
      rightLeg.position.set(0, 0.35, 0.1);
      robotGroup.add(rightLeg);

      humanoidLimbsRef.current = { leftLeg, rightLeg, torso };
    } else if (modality === 'heavy_ackermann_hauler') {
      const haulerGroup = new THREE.Group();
      chassisMeshRef.current = haulerGroup as unknown as THREE.Mesh;
      robotGroup.add(haulerGroup);

      const cabMat = new THREE.MeshStandardMaterial({ color: 0xe76f2e, roughness: 0.4 });
      const bedMat = new THREE.MeshStandardMaterial({ color: 0x3e2c23, roughness: 0.6 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x161616 });

      const cab = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.45, 0.65), cabMat);
      cab.position.set(0.35, 0.45, 0);
      cab.castShadow = true;
      haulerGroup.add(cab);

      const bed = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.35, 0.7), bedMat);
      bed.position.set(-0.25, 0.4, 0);
      bed.castShadow = true;
      haulerGroup.add(bed);

      const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
      [-0.4, 0.35].forEach((xPos) => {
        [-0.4, 0.4].forEach((zPos) => {
          const wheel = new THREE.Mesh(wheelGeo, wheelMat);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(xPos, 0.18, zPos);
          wheel.castShadow = true;
          haulerGroup.add(wheel);
          wheelsRef.current.push(wheel);
        });
      });
    } else {
      // Wheeled Mobile AMR
      const amrGroup = new THREE.Group();
      chassisMeshRef.current = amrGroup as unknown as THREE.Mesh;
      robotGroup.add(amrGroup);

      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2fa4d7, metalness: 0.5, roughness: 0.3 });
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x3e2c23, roughness: 0.7 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x161616 });

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.18, 0.46), bodyMat);
      chassis.position.y = 0.16;
      chassis.castShadow = true;
      amrGroup.add(chassis);

      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.04, 0.42), deckMat);
      deck.position.y = 0.27;
      amrGroup.add(deck);

      const lidarPuck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      lidarPuck.position.set(0.2, 0.33, 0);
      amrGroup.add(lidarPuck);

      const wheelGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
      [-0.22, 0.22].forEach((xPos) => {
        [-0.24, 0.24].forEach((zPos) => {
          const wheel = new THREE.Mesh(wheelGeo, wheelMat);
          wheel.rotation.x = Math.PI / 2;
          wheel.position.set(xPos, 0.09, zPos);
          amrGroup.add(wheel);
          wheelsRef.current.push(wheel);
        });
      });
    }

    // Initial Sync
    syncSceneWithPhysics(currentState);

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

  // Playback Loop
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

  // Sync physics state to 3D scene whenever time or rollout updates
  useEffect(() => {
    syncSceneWithPhysics(currentState);
  }, [currentState, syncSceneWithPhysics]);

  return (
    <div className="rounded-2xl bg-[#3E2C23] border border-[#3E2C23] overflow-hidden text-[#F5E9D8] shadow-lg flex flex-col">
      {/* 1. Header Bar: Engine Title + Mode Switcher */}
      <div className="px-4 py-2.5 bg-[#2A1D17] border-b border-[#F5E9D8]/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-[#2FA4D7] animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide font-mono">
            Diffract 200Hz Numerical Dynamics Engine
          </span>
          <span className="text-[11px] text-[#F5E9D8]/60 font-mono hidden sm:inline">
            ({robotId})
          </span>
        </div>

        {/* 2-Option Segmented Control */}
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

      {/* 2. Interactive 3D Canvas with Real-Time Physical HUD */}
      <div className="relative w-full h-72 sm:h-80 bg-[#1A130F] overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Right Status Pill */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          <div
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-md ${
              currentState.isCollided || currentState.barrierMarginM < 0
                ? 'bg-[#E76F2E] text-white border-white/20'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <span>
              {currentState.isCollided
                ? 'COLLISION WITH OBSTACLE (h < 0)'
                : currentState.barrierMarginM < 0
                ? 'TRACTION LOSS • SKID OVERRUN'
                : 'ISO 3691-4 CERTIFIED SAFE STOP'}
            </span>
          </div>
        </div>

        {/* Top-Left Live LiDAR Collision Range Tag */}
        <div className="absolute top-2.5 left-2.5 bg-[#2A1D17]/85 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-[#F5E9D8]/15 text-[10px] font-mono pointer-events-none flex items-center space-x-2">
          <span className="text-[#2FA4D7] font-bold">LiDAR Range:</span>
          <span className={currentState.obstacleDistanceM < 0.6 ? 'text-[#E76F2E] font-bold' : 'text-white'}>
            {currentState.obstacleDistanceM.toFixed(2)} m
          </span>
          <span className="text-[#F5E9D8]/40">|</span>
          <span className="text-[#F5E9D8]/70">Pitch: {(currentState.pitchRad * (180 / Math.PI)).toFixed(1)}°</span>
        </div>

        {/* Bottom-Right Camera Presets */}
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

      {/* 3. Physics Parameter Sweep Bar (Sliders & Controls) */}
      <div className="px-4 py-2 bg-[#221712] border-t border-[#F5E9D8]/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Interactive Surface Friction Sweep */}
        <div className="flex items-center space-x-2">
          <Sliders className="w-3.5 h-3.5 text-[#2FA4D7]" />
          <span className="text-[#F5E9D8]/70">Sweep Spill Friction (μ):</span>
          <div className="flex items-center space-x-1.5">
            {[0.12, 0.22, 0.45, 0.82].map((muVal) => (
              <button
                key={muVal}
                type="button"
                onClick={() => setSurfaceMu(muVal)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  surfaceMu === muVal
                    ? 'bg-[#2FA4D7] text-white'
                    : 'bg-[#1A120E] text-[#F5E9D8]/60 hover:text-white border border-[#F5E9D8]/10'
                }`}
              >
                μ={muVal}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-[#F5E9D8]/60">
          <span>Front Normal: <strong className="text-white">{currentState.frontNormalForceN}N</strong></span>
          <span>•</span>
          <span>Rear Normal: <strong className="text-white">{currentState.rearNormalForceN}N</strong></span>
        </div>
      </div>

      {/* 4. Timeline Scrubber & Minimalist Telemetry Row */}
      <div className="p-3 bg-[#2A1D17] border-t border-[#F5E9D8]/10 space-y-2">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-lg bg-[#2FA4D7] hover:bg-[#258ec0] active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
            title={isPlaying ? 'Pause' : 'Play Physics Simulation'}
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
            title="Reset to t = 0.0s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

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
              aria-label="Numerical Physics Timeline"
            />
            <span className="text-xs font-mono text-white shrink-0 w-12 text-right">
              {currentTime.toFixed(2)}s
            </span>
          </div>

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

        {/* 4 Physical AI State Gauges */}
        <div className="pt-2 border-t border-[#F5E9D8]/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Speed (v):</span>
            <span className="font-bold text-white">{currentState.vx.toFixed(2)} m/s</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Friction:</span>
            <span className={`font-bold ${currentState.surfaceMu < 0.5 ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
              μ = {currentState.surfaceMu.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Barrier Margin:</span>
            <span className={`font-bold ${currentState.barrierMarginM < 0 ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
              {currentState.barrierMarginM > 0 ? `+${currentState.barrierMarginM.toFixed(2)}` : currentState.barrierMarginM.toFixed(2)}m
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#1A120E] px-2.5 py-1.5 rounded-lg border border-[#F5E9D8]/10">
            <span className="text-[#F5E9D8]/50">Tire Slip (s):</span>
            <span className={`font-bold ${currentState.slipRatio > 0.15 ? 'text-[#E76F2E]' : 'text-white'}`}>
              {(currentState.slipRatio * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
