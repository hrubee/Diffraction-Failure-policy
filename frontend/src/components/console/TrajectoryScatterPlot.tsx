/**
 * Presentation Component: Odometry Trajectory Scatter Plot
 * Visualizes planned vs actual vs hazard corridor using Chart.js.
 */

'use client';

import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { OdometryPoint } from '@/domain/kinematics/types';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface TrajectoryScatterPlotProps {
  readonly planned: readonly OdometryPoint[];
  readonly actual: readonly OdometryPoint[];
  readonly hazard: readonly OdometryPoint[];
  readonly hazardLabel: string;
}

export const TrajectoryScatterPlot: React.FC<TrajectoryScatterPlotProps> = ({
  planned,
  actual,
  hazard,
  hazardLabel,
}) => {
  const data = {
    datasets: [
      {
        label: 'Nominal Planned Path',
        data: planned.map((p) => ({ x: p.x, y: p.y })),
        borderColor: '#059669',
        backgroundColor: '#059669',
        showLine: true,
        borderWidth: 2,
      },
      {
        label: 'Incident Telemetry Path',
        data: actual.map((p) => ({ x: p.x, y: p.y })),
        borderColor: '#dc2626',
        backgroundColor: '#dc2626',
        showLine: true,
        borderDash: [5, 5],
        borderWidth: 2,
      },
      {
        label: hazardLabel || 'Hazard Boundary',
        data: hazard.map((p) => ({ x: p.x, y: p.y })),
        borderColor: '#d97706',
        backgroundColor: '#d97706',
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: 'Forward Distance X (m)', color: '#64748b', font: { size: 10 } },
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
      y: {
        title: { display: true, text: 'Lateral Deviation Y (m)', color: '#64748b', font: { size: 10 } },
        grid: { color: '#e2e8f0' },
        ticks: { color: '#64748b', font: { size: 10 } },
      },
    },
    plugins: {
      legend: {
        labels: { color: '#334155', font: { size: 10, weight: 600 as const } },
      },
    },
  };

  return (
    <div className="relative h-64 sm:h-72 w-full bg-slate-50 rounded-xl p-3 border border-slate-200">
      <Scatter data={data} options={options} />
    </div>
  );
};
