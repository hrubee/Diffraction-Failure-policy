/**
 * Domain Entities: Global Proving Grounds & ODD Baselines
 */

import { RobotModality } from '../kinematics/types';

export interface ProvingGroundSite {
  readonly id: string;
  readonly name: string;
  readonly location: string;
  readonly primaryModality: RobotModality;
  readonly robotModel: string;
  readonly hazardDescription: string;
  readonly surfaceMu: string;
  readonly enforcedGovernor: string;
  readonly stoppingMargin: string;
  readonly riskTier: 'MANAGED' | 'LOW RISK' | 'CRITICAL';
}

export const PROVING_GROUNDS: readonly ProvingGroundSite[] = [
  {
    id: 'munich',
    name: 'Bipedal Humanoid Testbed',
    location: 'Isaac Sim Dynamic Benchmark',
    primaryModality: 'bipedal_humanoid',
    robotModel: 'Bipedal Humanoid (Digit Class)',
    hazardDescription: 'Wet Low-Friction Treadway Slip (μ = 0.28)',
    surfaceMu: 'μ = 0.28',
    enforcedGovernor: 'ZMP Margin ≥ 0.048m',
    stoppingMargin: '+0.42 m',
    riskTier: 'MANAGED',
  },
  {
    id: 'nevada',
    name: 'Heavy Hauler Quarry Testbed',
    location: 'PhysX 5 Heavy Vehicle Benchmark',
    primaryModality: 'heavy_ackermann_hauler',
    robotModel: 'Heavy Hauler (50-Ton Class)',
    hazardDescription: '12% Grade Unpaved Slurry Slide',
    surfaceMu: 'μ = 0.42 (Slurry)',
    enforcedGovernor: 'Grade Braking 0.65 m/s',
    stoppingMargin: '+1.24 m',
    riskTier: 'MANAGED',
  },
  {
    id: 'stuttgart',
    name: 'Collaborative Arm Cell',
    location: 'Isaac Lab Manipulator Benchmark',
    primaryModality: 'articulated_manipulator_arm',
    robotModel: '6-DOF Arm (ISO/TS 15066)',
    hazardDescription: '195N Dynamic Contact Wrench Spike',
    surfaceMu: 'Biomechanical Contact',
    enforcedGovernor: 'PFL Force Cap ≤ 140N',
    stoppingMargin: '+0.08 m',
    riskTier: 'LOW RISK',
  },
  {
    id: 'chicago',
    name: 'Warehouse Logistics Testbed',
    location: 'ROS 2 Nav2 Simulation Benchmark',
    primaryModality: 'industrial_differential_drive',
    robotModel: 'Industrial AMR (500kg Class)',
    hazardDescription: 'Polished Wet Epoxy Wheel Slip (μ = 0.35)',
    surfaceMu: 'μ = 0.35',
    enforcedGovernor: 'Nav2 Speed Cap 0.75 m/s',
    stoppingMargin: '+0.48 m',
    riskTier: 'LOW RISK',
  },
  {
    id: 'tokyo',
    name: 'Sidewalk Delivery Rover Testbed',
    location: 'Outdoor Sensor-Fusion Benchmark',
    primaryModality: 'urban_delivery_rover',
    robotModel: 'Sidewalk Rover (ISO 22737)',
    hazardDescription: '92,000 Lux Crosswalk Specular Glare',
    surfaceMu: 'μ = 0.60 (Wet Asphalt)',
    enforcedGovernor: 'Exposure Mask 0.80 m/s',
    stoppingMargin: '+0.65 m',
    riskTier: 'LOW RISK',
  },
];
