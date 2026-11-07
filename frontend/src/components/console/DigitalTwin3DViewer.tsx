/**
 * Presentation Component: Interactive Incident Flight Recorder & 3D Digital Twin Viewport
 * 
 * Replaces static spinning turntable with authentic "Black Box Reconstruction":
 * 1. Time-series scrubbing (t = 0.0s to 4.0s) with Play/Pause/Scrub
 * 2. "Before vs After" Comparison: Baseline Incident (Unprotected Skid) vs Diffract Governor™ (Safe Stop)
 * 3. Dynamic Skid Marks, Friction Surface Transition, and Lyapunov Safety Bubble
 * 4. Real-time Telemetry HUD (Speed, Friction μ, Barrier Margin h(x), Slip Ratio)
 * 5. Full 3D Camera OrbitControls with preset viewports (Isometric, Top-Down, Chase)
 * 
 * Palette: #2FA4D7 (Blue), #F5E9D8 (Beige Canvas), #3E2C23 (Espresso Brown), #E76F2E (Safety Orange)
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Layers,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
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
  status,
  plannedPoints,
  actualPoints,
  hazardPoints,
  hazardLabel = 'Corridor Friction Transition Hazard',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Flight Recorder Playback State
  const [currentTime, setCurrentTime] = useState<number>(2.4); // Start at critical incident point
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [simulationMode, setSimulationMode] = useState<'baseline' | 'diffract'>('baseline');
  const [cameraView, setCameraView] = useState<'iso' | 'top' | 'chase'>('iso');

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const robotGroupRef = useRef<THREE.Group | null>(null);
  const safetyBubbleRef = useRef<THREE.Mesh | null>(null);
  const skidMarksRef = useRef<THREE.LineSegments | null>(null);
  const lidarBeamRef = useRef<THREE.Mesh | null>(null);
  const humanoidLimbsRef = useRef<{ leftLeg: THREE.Mesh; rightLeg: THREE.Mesh; torso: THREE.Mesh } | null>(null);
  const wheelsRef = useRef<THREE.Mesh[]>([]);

  // Telemetry Derived Values for HUD
  const isSlickZone = currentTime >= 1.6;
  const currentFriction = isSlickZone ? 0.22 : 0.82;
  
  // Baseline trajectory values
  let currentSpeed = 1.65;
  let slipRatio = 3.2;
  let barrierMargin = 1.25;
  let incidentStatus = 'NOMINAL_CORRIDOR_TRACKING';
  let isViolation = false;

  if (simulationMode === 'baseline') {
    if (currentTime < 1.6) {
      currentSpeed = 1.65;
      slipRatio = 3.2;
      barrierMargin = +(2.5 - currentTime * 1.0).toFixed(2);
      incidentStatus = 'NOMINAL_CORRIDOR_TRACKING';
    } else if (currentTime < 2.4) {
      currentSpeed = Math.max(0.4, 1.65 - (currentTime - 1.6) * 1.2);
      slipRatio = 28.5; // Traction loss
      barrierMargin = -0.35;
      incidentStatus = 'SLICK_SPILL_ENTRY_TRACTION_LOSS';
      isViolation = true;
    } else {
      currentSpeed = 0.0;
      slipRatio = 42.0;
      barrierMargin = -0.84;
      incidentStatus = 'CRITICAL_SAFETY_INVARIANT_BREACH';
      isViolation = true;
    }
  } else {
    // Diffract Governor™ Mode
    if (currentTime < 1.6) {
      currentSpeed = 1.65;
      slipRatio = 3.2;
      barrierMargin = +(2.5 - currentTime * 1.0).toFixed(2);
      incidentStatus = 'NOMINAL_CORRIDOR_TRACKING';
    } else if (currentTime < 2.8) {
      // Governor clamps deceleration safely to mu * g
      currentSpeed = Math.max(0.0, 1.65 - (currentTime - 1.6) * 1.4);
      slipRatio = 4.8; // Governor prevents slip
      barrierMargin = +(0.85 - (currentTime - 1.6) * 0.35).toFixed(2);
      incidentStatus = 'DIFFRACT_GOVERNOR_ACTIVE_BRAKING';
    } else {
      currentSpeed = 0.0;
      slipRatio = 0.0;
      barrierMargin = 0.42; // Certified safe stopping cushion!
      incidentStatus = 'CONTROLLED_SAFE_STOP_CERTIFIED';
    }
  }

  // Calculate robot 3D position & yaw at time t
  const getTrajectoryState = useCallback((t: number, mode: 'baseline' | 'diffract') => {
    let x = 0;
    let y = 0;
    let yaw = 0;

    if (mode === 'baseline') {
      if (t <= 1.6) {
        // Nominal approach
        const alpha = t / 1.6;
        x = -1.8 + alpha * 1.6; // Moves from -1.8 to -0.2
        y = 0;
        yaw = 0;
      } else if (t <= 2.6) {
        // Skid and drift on slick spill
        const alpha = (t - 1.6) / 1.0;
        x = -0.2 + alpha * 1.4; // Moves to 1.2
        y = alpha * 0.48; // Lateral drift into barrier
        yaw = alpha * 0.38; // 22 degrees yaw rotation
      } else {
        // Final resting crash pose
        const alpha = Math.min(1.0, (t - 2.6) / 0.8);
        x = 1.2 + alpha * 0.45; // Overrun to 1.65m (past safe envelope)
        y = 0.48 + alpha * 0.14;
        yaw = 0.38 + alpha * 0.08;
      }
    } else {
      // Diffract Governor™ Safe Stop
      if (t <= 1.6) {
        const alpha = t / 1.6;
        x = -1.8 + alpha * 1.6;
        y = 0;
        yaw = 0;
      } else if (t <= 2.8) {
        // Governed in-corridor deceleration (ZERO lateral drift)
        const alpha = (t - 1.6) / 1.2;
        // Ease out quadratic deceleration
        const eased = 1 - Math.pow(1 - alpha, 2);
        x = -0.2 + eased * 1.05; // Stops at 0.85m (0.45m before obstacle!)
        y = 0;
        yaw = 0;
      } else {
        x = 0.85;
        y = 0;
        yaw = 0;
      }
    }

    return { x, y, yaw };
  }, []);

  // Sync robot model position, safety bubble, and skid marks
  const updateSceneForTime = useCallback((t: number, mode: 'baseline' | 'diffract') => {
    const { x, y, yaw } = getTrajectoryState(t, mode);

    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(x, 0, y);
      robotGroupRef.current.rotation.y = -yaw;
    }

    // Safety Bubble (Lyapunov Barrier Function Envelope)
    if (safetyBubbleRef.current) {
      const bubbleMesh = safetyBubbleRef.current;
      bubbleMesh.position.set(x + 0.35, 0.02, y);
      
      const mat = bubbleMesh.material as THREE.MeshBasicMaterial;
      if (mode === 'baseline') {
        if (t >= 1.6) {
          // Breaching the boundary: turn safety orange/red
          mat.color.setHex(0xe76f2e);
          bubbleMesh.scale.set(1.4 + (t - 1.6) * 0.5, 1.2, 1.0);
        } else {
          mat.color.setHex(0x2fa4d7);
          bubbleMesh.scale.set(1.0, 1.0, 1.0);
        }
      } else {
        // Diffract Governor: safely contracts inside allowable boundary
        mat.color.setHex(0x10b981);
        const contract = Math.max(0.65, 1.0 - (t - 1.6) * 0.25);
        bubbleMesh.scale.set(contract, contract, 1.0);
      }
    }

    // Wheel Rotation
    wheelsRef.current.forEach((wheel) => {
      if (t < 2.6 || (mode === 'diffract' && t < 2.8)) {
        wheel.rotation.x += 0.08 * (mode === 'baseline' && t >= 1.6 ? 2.5 : 1.0);
      }
    });

    // Humanoid Gait & Slip Stance
    if (humanoidLimbsRef.current) {
      const { leftLeg, rightLeg, torso } = humanoidLimbsRef.current;
      if (t < 1.6 || (mode === 'diffract' && t < 2.8)) {
        const gaitPhase = t * 6.0;
        leftLeg.rotation.x = Math.sin(gaitPhase) * 0.35;
        rightLeg.rotation.x = -Math.sin(gaitPhase) * 0.35;
        torso.rotation.x = 0.05;
      } else if (mode === 'baseline') {
        // Slipping backward: torso leans back, legs lose footing
        torso.rotation.x = -0.35;
        torso.rotation.z = 0.2;
        leftLeg.rotation.x = 0.6;
        rightLeg.rotation.x = 0.4;
      } else {
        // Diffract safe stance: knees slightly bent, stable ZMP
        torso.rotation.x = 0.0;
        torso.rotation.z = 0.0;
        leftLeg.rotation.x = 0.1;
        rightLeg.rotation.x = 0.1;
      }
    }

    // Rotating 3D LiDAR Scanner Puck
    if (lidarBeamRef.current) {
      lidarBeamRef.current.rotation.y += 0.12;
    }
  }, [getTrajectoryState]);

  // Set Camera Preset Views
  const applyCameraPreset = (view: 'iso' | 'top' | 'chase') => {
    setCameraView(view);
    if (!cameraRef.current || !controlsRef.current) return;

    if (view === 'iso') {
      cameraRef.current.position.set(2.4, 2.2, 3.2);
      controlsRef.current.target.set(0.2, 0.4, 0);
    } else if (view === 'top') {
      cameraRef.current.position.set(0.0, 5.0, 0.1);
      controlsRef.current.target.set(0.0, 0.0, 0.0);
    } else if (view === 'chase') {
      cameraRef.current.position.set(-2.8, 1.2, 0.0);
      controlsRef.current.target.set(0.8, 0.3, 0.2);
    }
    controlsRef.current.update();
  };

  // Three.js Scene Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1a1614'); // Deep espresso darkroom canvas
    sceneRef.current = scene;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.4, 2.2, 3.2);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera dipping below floor
    controls.minDistance = 1.0;
    controls.maxDistance = 12.0;
    controls.target.set(0.2, 0.4, 0);
    controlsRef.current = controls;

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x2fa4d7, 1.8);
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe76f2e, 0.7);
    fillLight.position.set(-3, 3, -3);
    scene.add(fillLight);

    // ==========================================
    // 1. INDUSTRIAL WAREHOUSE PROVING GROUND
    // ==========================================
    const floorGeo = new THREE.PlaneGeometry(12, 6);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x241d19,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Coordinate Grid
    const grid = new THREE.GridHelper(12, 24, 0x2fa4d7, 0x3e2c23);
    grid.position.y = 0.005;
    scene.add(grid);

    // Yellow Safety Corridor Lanes
    [-0.9, 0.9].forEach((yPos) => {
      const lineGeo = new THREE.PlaneGeometry(10, 0.08);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.008, yPos);
      scene.add(line);
    });

    // ==========================================
    // 2. SLICK CONTAMINATED SPILL ZONE (μ = 0.22)
    // ==========================================
    const spillGeo = new THREE.PlaneGeometry(3.2, 1.8);
    const spillMat = new THREE.MeshStandardMaterial({
      color: 0x1d303d, // Dark glossy slick liquid
      roughness: 0.05, // Wet mirror-like sheen
      metalness: 0.8,
      transparent: true,
      opacity: 0.88,
    });
    const spill = new THREE.Mesh(spillGeo, spillMat);
    spill.rotation.x = -Math.PI / 2;
    spill.position.set(0.6, 0.012, 0.2); // Sits right in the vehicle's path
    scene.add(spill);

    // Hazard Stripes Around Spill Perimeter
    const hazardBorderGeo = new THREE.RingGeometry(1.6, 1.66, 4);
    const hazardBorderMat = new THREE.MeshBasicMaterial({
      color: 0xe76f2e,
      side: THREE.DoubleSide,
    });
    const hazardBorder = new THREE.Mesh(hazardBorderGeo, hazardBorderMat);
    hazardBorder.rotation.x = -Math.PI / 2;
    hazardBorder.position.set(0.6, 0.014, 0.2);
    scene.add(hazardBorder);

    // ==========================================
    // 3. COLLISION OBSTACLE (Pallet + Cargo Crate)
    // ==========================================
    const obstacleGroup = new THREE.Group();
    obstacleGroup.position.set(1.9, 0, 0.55); // Located at the end of the skid zone

    // Wooden Pallet Base
    const palletGeo = new THREE.BoxGeometry(0.8, 0.12, 0.8);
    const palletMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const pallet = new THREE.Mesh(palletGeo, palletMat);
    pallet.position.y = 0.06;
    pallet.castShadow = true;
    obstacleGroup.add(pallet);

    // Staging Cargo Crate with Hazard Plate
    const crateGeo = new THREE.BoxGeometry(0.7, 0.65, 0.7);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0xe76f2e, roughness: 0.4 });
    const crate = new THREE.Mesh(crateGeo, crateMat);
    crate.position.y = 0.44;
    crate.castShadow = true;
    obstacleGroup.add(crate);

    // Strobe Warning Light on Obstacle
    const strobeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
    const strobeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const strobe = new THREE.Mesh(strobeGeo, strobeMat);
    strobe.position.set(0, 0.82, 0);
    obstacleGroup.add(strobe);

    scene.add(obstacleGroup);

    // ==========================================
    // 4. TRAJECTORY PATH RIBBONS
    // ==========================================
    // Green Nominal Path
    const nomPoints = [
      new THREE.Vector3(-1.8, 0.02, 0),
      new THREE.Vector3(-0.6, 0.02, 0),
      new THREE.Vector3(0.6, 0.02, 0),
      new THREE.Vector3(1.8, 0.02, 0),
    ];
    const nomGeo = new THREE.BufferGeometry().setFromPoints(nomPoints);
    const nomMat = new THREE.LineBasicMaterial({ color: 0x10b981, linewidth: 2 });
    const nomLine = new THREE.Line(nomGeo, nomMat);
    scene.add(nomLine);

    // Red Skid Deviation Path (Baseline Unprotected)
    const skidPoints = [
      new THREE.Vector3(-0.2, 0.022, 0),
      new THREE.Vector3(0.4, 0.022, 0.15),
      new THREE.Vector3(1.1, 0.022, 0.42),
      new THREE.Vector3(1.65, 0.022, 0.62),
    ];
    const skidGeo = new THREE.BufferGeometry().setFromPoints(skidPoints);
    const skidMat = new THREE.LineDashedMaterial({
      color: 0xef4444,
      dashSize: 0.15,
      gapSize: 0.08,
      linewidth: 3,
    });
    const skidLine = new THREE.Line(skidGeo, skidMat);
    skidLine.computeLineDistances();
    scene.add(skidLine);

    // Cyan Diffract-Governed Path
    const diffPoints = [
      new THREE.Vector3(-0.2, 0.024, 0),
      new THREE.Vector3(0.3, 0.024, 0),
      new THREE.Vector3(0.85, 0.024, 0),
    ];
    const diffGeo = new THREE.BufferGeometry().setFromPoints(diffPoints);
    const diffMat = new THREE.LineBasicMaterial({ color: 0x2fa4d7, linewidth: 3 });
    const diffLine = new THREE.Line(diffGeo, diffMat);
    scene.add(diffLine);

    // ==========================================
    // 5. LYAPUNOV BARRIER SAFETY BUBBLE
    // ==========================================
    const bubbleGeo = new THREE.RingGeometry(0.45, 0.55, 32);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: 0x2fa4d7,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const safetyBubble = new THREE.Mesh(bubbleGeo, bubbleMat);
    safetyBubble.rotation.x = -Math.PI / 2;
    scene.add(safetyBubble);
    safetyBubbleRef.current = safetyBubble;

    // ==========================================
    // 6. ROBOT MODALITY 3D ASSEMBLED MESH
    // ==========================================
    const robotGroup = new THREE.Group();
    robotGroupRef.current = robotGroup;
    scene.add(robotGroup);

    wheelsRef.current = [];
    humanoidLimbsRef.current = null;

    if (modality === 'bipedal_humanoid') {
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2fa4d7, metalness: 0.6, roughness: 0.3 });
      const jointMat = new THREE.MeshStandardMaterial({ color: 0x3e2c23 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.55, 0.2), bodyMat);
      torso.position.y = 0.95;
      robotGroup.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), bodyMat);
      head.position.y = 1.35;
      robotGroup.add(head);

      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.65), jointMat);
      leftLeg.position.set(-0.11, 0.4, 0);
      robotGroup.add(leftLeg);

      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.65), jointMat);
      rightLeg.position.set(0.11, 0.4, 0);
      robotGroup.add(rightLeg);

      humanoidLimbsRef.current = { leftLeg, rightLeg, torso };
    } else if (modality === 'heavy_ackermann_hauler') {
      const cabMat = new THREE.MeshStandardMaterial({ color: 0xe76f2e, roughness: 0.4 });
      const chassisMat = new THREE.MeshStandardMaterial({ color: 0x221a16 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 1.3), cabMat);
      cabin.position.y = 0.55;
      robotGroup.add(cabin);

      [-0.48, 0.48].forEach((xPos) => {
        [-0.45, 0.45].forEach((zPos) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.16, 16), wheelMat);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(xPos, 0.2, zPos);
          robotGroup.add(wheel);
          wheelsRef.current.push(wheel);
        });
      });
    } else {
      // Wheeled Mobile AMR (Default High-Density Asset)
      const amrBodyMat = new THREE.MeshStandardMaterial({ color: 0x2fa4d7, metalness: 0.5, roughness: 0.3 });
      const deckMat = new THREE.MeshStandardMaterial({ color: 0x3e2c23, roughness: 0.7 });
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

      const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.24, 0.5), amrBodyMat);
      chassis.position.y = 0.18;
      robotGroup.add(chassis);

      const deck = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.04, 0.46), deckMat);
      deck.position.y = 0.32;
      robotGroup.add(deck);

      // Rotating 3D LiDAR Puck
      const lidarBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.08, 16),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
      );
      lidarBase.position.set(0.18, 0.38, 0);
      robotGroup.add(lidarBase);

      const lidarBeamGeo = new THREE.ConeGeometry(0.8, 0.2, 16, 1, true);
      const lidarBeamMat = new THREE.MeshBasicMaterial({
        color: 0x2fa4d7,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const lidarBeam = new THREE.Mesh(lidarBeamGeo, lidarBeamMat);
      lidarBeam.rotation.z = Math.PI / 2;
      lidarBeam.position.set(0.6, 0.38, 0);
      robotGroup.add(lidarBeam);
      lidarBeamRef.current = lidarBeam;

      // Wheels
      [-0.22, 0.22].forEach((xPos) => {
        [-0.26, 0.26].forEach((zPos) => {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16), wheelMat);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(xPos, 0.1, zPos);
          robotGroup.add(wheel);
          wheelsRef.current.push(wheel);
        });
      });
    }

    // Initial positioning
    updateSceneForTime(currentTime, simulationMode);

    // Animation Loop
    let animId: number;
    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      controls.update();
      renderer.render(scene, camera);
    };
    renderLoop();

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modality]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Playback Loop Timer
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

  // Sync scene when time or mode changes
  useEffect(() => {
    updateSceneForTime(currentTime, simulationMode);
  }, [currentTime, simulationMode, updateSceneForTime]);

  return (
    <div className="rounded-2xl bg-[#3E2C23] border-2 border-[#2FA4D7] overflow-hidden text-[#F5E9D8] shadow-2xl flex flex-col">
      {/* 1. Header Bar: Incident Header & Before/After Comparison Switcher */}
      <div className="px-4 py-3 bg-[#2A1D17] border-b border-[#F5E9D8]/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center space-x-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#E76F2E] animate-pulse" />
          <div>
            <h3 className="text-xs font-bold font-mono tracking-wide text-white uppercase flex items-center space-x-2">
              <span>Diffract Incident Flight Recorder</span>
              <span className="text-[#2FA4D7] text-[10px] bg-[#2FA4D7]/15 px-1.5 py-0.5 rounded border border-[#2FA4D7]/30">
                OpenUSD 3D Twin
              </span>
            </h3>
            <p className="text-[11px] text-[#F5E9D8]/70 font-mono">
              Target: <strong className="text-white">{robotId}</strong> • {hazardLabel}
            </p>
          </div>
        </div>

        {/* Before vs After Comparison Mode Selector */}
        <div className="flex items-center bg-[#1A120E] p-1 rounded-xl border border-[#F5E9D8]/15 space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => setSimulationMode('baseline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
              simulationMode === 'baseline'
                ? 'bg-[#E76F2E] text-white shadow-sm'
                : 'text-[#F5E9D8]/60 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Baseline Incident (Unprotected)</span>
          </button>

          <button
            type="button"
            onClick={() => setSimulationMode('diffract')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer ${
              simulationMode === 'diffract'
                ? 'bg-[#2FA4D7] text-white shadow-sm'
                : 'text-[#F5E9D8]/60 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diffract Governor™ (Active Patch)</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive 3D Canvas with HUD Overlays */}
      <div className="relative w-full h-80 sm:h-96 bg-[#1A1614] overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Left Telemetry Tag */}
        <div className="absolute top-3 left-3 bg-[#2A1D17]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-[#F5E9D8]/15 text-[11px] font-mono space-y-0.5 pointer-events-none shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-[#2FA4D7] font-bold">t = {currentTime.toFixed(2)}s</span>
            <span className="text-[#F5E9D8]/40">/</span>
            <span className="text-[#F5E9D8]/70">4.00s</span>
          </div>
          <div className="text-[10px] text-[#F5E9D8]/60 uppercase">
            Phase: <strong className="text-white">{currentTime < 1.6 ? 'Approach' : currentTime < 2.6 ? 'Spill Contact' : 'Rest'}</strong>
          </div>
        </div>

        {/* Top-Right Incident Alert Pill */}
        <div className="absolute top-3 right-3 pointer-events-none">
          {simulationMode === 'baseline' ? (
            <div
              className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-lg ${
                isViolation
                  ? 'bg-[#E76F2E] text-white border-white/20 animate-pulse'
                  : 'bg-[#2A1D17]/90 text-[#F5E9D8] border-[#F5E9D8]/20'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{isViolation ? 'CRITICAL SAFETY INVARIANT BREACH' : 'NOMINAL CORRIDOR'}</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 text-[11px] font-mono font-bold flex items-center space-x-1.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>SAFETY INVARIANT PRESERVED (ISO 3691-4)</span>
            </div>
          )}
        </div>

        {/* Bottom-Right Camera Preset Switcher */}
        <div className="absolute bottom-3 right-3 flex items-center bg-[#2A1D17]/90 backdrop-blur-md p-1 rounded-lg border border-[#F5E9D8]/15 space-x-1 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => applyCameraPreset('iso')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'iso' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/70 hover:text-white'}`}
          >
            ISO 3D
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('top')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'top' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/70 hover:text-white'}`}
          >
            TOP 2D
          </button>
          <button
            type="button"
            onClick={() => applyCameraPreset('chase')}
            className={`px-2 py-1 rounded transition-colors ${cameraView === 'chase' ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/70 hover:text-white'}`}
          >
            CHASE
          </button>
        </div>

        {/* Visual Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 hidden sm:flex items-center space-x-3 bg-[#2A1D17]/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#F5E9D8]/10 text-[10px] font-mono text-[#F5E9D8]/70 pointer-events-none">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-1 bg-[#10B981] rounded-full inline-block" />
            <span>Nominal Path</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-1 bg-[#EF4444] rounded-full inline-block" />
            <span>Skid Drift</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-1 bg-[#2FA4D7] rounded-full inline-block" />
            <span>Diffract Stop</span>
          </div>
        </div>
      </div>

      {/* 3. Scrubbable Timeline Player Controls */}
      <div className="p-4 bg-[#2A1D17] border-t border-[#F5E9D8]/15 space-y-3">
        {/* Playback Button + Slider + Scrub Indicators */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-xl bg-[#2FA4D7] hover:bg-[#258ec0] active:scale-95 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-md"
            title={isPlaying ? 'Pause' : 'Play Flight Reconstruction'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentTime(0.0);
            }}
            className="w-9 h-9 rounded-xl bg-[#1A120E] hover:bg-black text-[#F5E9D8]/80 hover:text-white border border-[#F5E9D8]/15 flex items-center justify-center transition-all shrink-0 cursor-pointer"
            title="Rewind to t = 0.0s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timeline Slider with Milestone Ticks */}
          <div className="relative flex-1">
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
              aria-label="Incident Timeline Scrub Slider"
            />
            {/* Timeline Milestones */}
            <div className="flex justify-between text-[10px] font-mono text-[#F5E9D8]/50 pt-1">
              <span className="hover:text-white cursor-pointer" onClick={() => setCurrentTime(0.0)}>0.0s [Start]</span>
              <span className="hover:text-[#E76F2E] cursor-pointer" onClick={() => setCurrentTime(1.6)}>1.6s [Spill Breach]</span>
              <span className="hover:text-[#E76F2E] cursor-pointer" onClick={() => setCurrentTime(2.4)}>2.4s [Slip / E-Stop]</span>
              <span className="hover:text-white cursor-pointer" onClick={() => setCurrentTime(4.0)}>4.0s [Rest]</span>
            </div>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center space-x-1 shrink-0 bg-[#1A120E] px-1.5 py-1 rounded-lg border border-[#F5E9D8]/15 text-[10px] font-mono">
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === s ? 'bg-[#2FA4D7] text-white font-bold' : 'text-[#F5E9D8]/60 hover:text-white'}`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* 4. Live Physical AI Telemetry Gauges (Flight Recorder HUD) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#F5E9D8]/10 font-mono text-xs">
          {/* Gauge 1: Velocity */}
          <div className="p-2.5 rounded-xl bg-[#1A120E] border border-[#F5E9D8]/10 space-y-1">
            <div className="text-[10px] text-[#F5E9D8]/60 uppercase flex justify-between">
              <span>Velocity (v)</span>
              <span className="text-[#2FA4D7]">m/s</span>
            </div>
            <div className="text-base font-bold text-white">
              {currentSpeed.toFixed(2)} <span className="text-xs font-normal text-[#F5E9D8]/50">m/s</span>
            </div>
            <div className="w-full bg-[#3E2C23] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2FA4D7] h-full transition-all"
                style={{ width: `${Math.min(100, (currentSpeed / 2.0) * 100)}%` }}
              />
            </div>
          </div>

          {/* Gauge 2: Surface Friction */}
          <div className="p-2.5 rounded-xl bg-[#1A120E] border border-[#F5E9D8]/10 space-y-1">
            <div className="text-[10px] text-[#F5E9D8]/60 uppercase flex justify-between">
              <span>Surface Friction (μ)</span>
              <span className={isSlickZone ? 'text-[#E76F2E]' : 'text-emerald-400'}>
                {isSlickZone ? 'WET SPILL' : 'DRY EPOXY'}
              </span>
            </div>
            <div className="text-base font-bold text-white">
              μ = {currentFriction.toFixed(2)}
            </div>
            <div className="w-full bg-[#3E2C23] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${isSlickZone ? 'bg-[#E76F2E]' : 'bg-emerald-400'}`}
                style={{ width: `${(currentFriction / 1.0) * 100}%` }}
              />
            </div>
          </div>

          {/* Gauge 3: Lyapunov Barrier Margin */}
          <div className="p-2.5 rounded-xl bg-[#1A120E] border border-[#F5E9D8]/10 space-y-1">
            <div className="text-[10px] text-[#F5E9D8]/60 uppercase flex justify-between">
              <span>Barrier Margin h(x)</span>
              <span className={barrierMargin < 0 ? 'text-[#E76F2E]' : 'text-emerald-400'}>
                {barrierMargin < 0 ? 'BREACH' : 'SAFE'}
              </span>
            </div>
            <div className={`text-base font-bold ${barrierMargin < 0 ? 'text-[#E76F2E]' : 'text-emerald-400'}`}>
              {barrierMargin > 0 ? `+${barrierMargin.toFixed(2)}` : barrierMargin.toFixed(2)} m
            </div>
            <div className="text-[10px] text-[#F5E9D8]/50 truncate">
              {simulationMode === 'baseline' ? 'Overrun past barrier' : 'Certified Safe Cushion'}
            </div>
          </div>

          {/* Gauge 4: Slip Ratio */}
          <div className="p-2.5 rounded-xl bg-[#1A120E] border border-[#F5E9D8]/10 space-y-1">
            <div className="text-[10px] text-[#F5E9D8]/60 uppercase flex justify-between">
              <span>Wheel Slip Ratio (S)</span>
              <span className={slipRatio > 15 ? 'text-[#E76F2E]' : 'text-[#2FA4D7]'}>
                {slipRatio > 15 ? 'LOSS OF TRACTION' : 'NOMINAL'}
              </span>
            </div>
            <div className="text-base font-bold text-white">
              {slipRatio.toFixed(1)}%
            </div>
            <div className="w-full bg-[#3E2C23] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${slipRatio > 15 ? 'bg-[#E76F2E]' : 'bg-[#2FA4D7]'}`}
                style={{ width: `${Math.min(100, (slipRatio / 50.0) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
