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
    name: 'Munich Proving Ground',
    location: 'Munich, Germany',
    primaryModality: 'bipedal_humanoid',
    robotModel: 'Bipedal Humanoid (Digit v3)',
    hazardDescription: 'Wet Low-Friction Treadway Slip (μ = 0.28)',
    surfaceMu: 'μ = 0.28',
    enforcedGovernor: 'ZMP Margin ≥ 0.048m',
    stoppingMargin: '+0.42 m',
    riskTier: 'MANAGED',
  },
  {
    id: 'nevada',
    name: 'Nevada Heavy Autonomy',
    location: 'Nevada Testbed, USA',
    primaryModality: 'heavy_ackermann_hauler',
    robotModel: 'Heavy Hauler (Titan 12T)',
    hazardDescription: '12% Grade Unpaved Slurry Slide',
    surfaceMu: 'μ = 0.42 (Slurry)',
    enforcedGovernor: 'Grade Braking 0.65 m/s',
    stoppingMargin: '+1.24 m',
    riskTier: 'MANAGED',
  },
  {
    id: 'stuttgart',
    name: 'Stuttgart Automation Cell',
    location: 'Stuttgart, Germany',
    primaryModality: 'articulated_manipulator_arm',
    robotModel: '6-DOF Arm (UR16e)',
    hazardDescription: '195N Dynamic Contact Wrench Spike',
    surfaceMu: 'Biomechanical Contact',
    enforcedGovernor: 'PFL Force Cap ≤ 140N',
    stoppingMargin: '+0.08 m',
    riskTier: 'LOW RISK',
  },
  {
    id: 'chicago',
    name: 'Chicago Logistics Hub',
    location: 'Chicago Hub, USA',
    primaryModality: 'industrial_differential_drive',
    robotModel: 'Wheeled AMR (Carrier 500)',
    hazardDescription: 'Polished Wet Epoxy Wheel Slip (μ = 0.35)',
    surfaceMu: 'μ = 0.35',
    enforcedGovernor: 'Nav2 Speed Cap 0.75 m/s',
    stoppingMargin: '+0.48 m',
    riskTier: 'LOW RISK',
  },
  {
    id: 'tokyo',
    name: 'Tokyo Urban Mobility',
    location: 'Tokyo, Japan',
    primaryModality: 'urban_delivery_rover',
    robotModel: 'Sidewalk Rover (Scout 08)',
    hazardDescription: '92,000 Lux Crosswalk Specular Glare',
    surfaceMu: 'μ = 0.60 (Wet Asphalt)',
    enforcedGovernor: 'Exposure Mask 0.80 m/s',
    stoppingMargin: '+0.65 m',
    riskTier: 'LOW RISK',
  },
];
