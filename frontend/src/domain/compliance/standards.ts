/**
 * Domain Entities: Regulatory Standards & Compliance Invariants
 */

import { RobotModality } from '../kinematics/types';

export interface StandardProfile {
  readonly standard: string;
  readonly title: string;
  readonly primaryClause: string;
  readonly safetyCeiling: string;
}

export const MODALITY_STANDARDS: Record<RobotModality, StandardProfile> = {
  bipedal_humanoid: {
    standard: 'ISO 13482:2014',
    title: 'Personal Care & Bipedal Balancing Robots',
    primaryClause: 'Clause 5.3 & 6.2 (Dynamic Balance & Foot Ground Reaction)',
    safetyCeiling: 'Zero-Moment Point (ZMP) stability margin >= 0.04m',
  },
  heavy_ackermann_hauler: {
    standard: 'ISO 17757:2019',
    title: 'Earth-Moving Machinery & Mining Autonomy',
    primaryClause: 'Clause 4.3 & 5.2 (Unpaved Grade Braking & Dynamic Rollover)',
    safetyCeiling: 'Grade braking stopping margin on 12% slope & ay < 0.28g',
  },
  articulated_manipulator_arm: {
    standard: 'ISO 10218-1 / ISO/TS 15066:2016',
    title: 'Collaborative Industrial Manipulators & Cobots',
    primaryClause: 'Clause 5.5 (Collaborative Power and Force Limiting - PFL)',
    safetyCeiling: 'Quasi-static contact force <= 140 N / Dynamic peak <= 210 N',
  },
  industrial_differential_drive: {
    standard: 'ISO 3691-4:2023 / ANSI R15.08',
    title: 'Driverless Industrial Trucks & Wheeled Mobile Platforms',
    primaryClause: 'Clause 5.2.3 (Dynamic Braking & Worst-Case Stopping Distance)',
    safetyCeiling: 'Clearance envelope >= 0.50m from personnel perimeter',
  },
  urban_delivery_rover: {
    standard: 'ISO 22737:2021 / UL 4600',
    title: 'Low-Speed Automated Driving Systems (LSADS) & Sidewalk Safety',
    primaryClause: 'Clause 5.2 & 6.3 (Pedestrian Crosswalk & Optical Solar Glare)',
    safetyCeiling: 'Pedestrian separation buffer >= 0.75m & 95,000 Lux glare immunity',
  },
};
