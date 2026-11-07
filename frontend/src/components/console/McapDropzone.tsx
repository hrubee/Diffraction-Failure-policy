/**
 * Presentation Component: Universal Telemetry Ingestion Dropzone (.mcap)
 */

'use client';

import React, { useRef, useState } from 'react';

interface McapDropzoneProps {
  readonly onFileSelected: (file: File) => void;
  readonly uploadedFileName: string | null;
  readonly uploadedFileDetails: string | null;
  readonly isLoading: boolean;
}

export const McapDropzone: React.FC<McapDropzoneProps> = ({
  onFileSelected,
  uploadedFileName,
  uploadedFileDetails,
  isLoading,
}) => {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white border border-subtle card-shadow space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mono">
          1. Universal Telemetry Ingestion (.mcap)
        </h3>
        <span className="text-[10px] text-blue-600 font-semibold mono">ROS 2 • Zenoh • Protobuf</span>
      </div>

      <div
        id="dropZone"
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-150 ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-100'
            : 'border-slate-300 hover:border-blue-500 bg-slate-50/70'
        }`}
      >
        {isLoading ? (
          <div className="py-3">
            <div className="animate-spin h-7 w-7 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-xs font-semibold text-blue-600 mono">Extracting physical kinematics…</p>
          </div>
        ) : uploadedFileName ? (
          <div className="py-1">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mb-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs font-bold text-slate-900 mono truncate max-w-[280px] mx-auto">
              {uploadedFileName}
            </p>
            {uploadedFileDetails && (
              <div className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap justify-center gap-1.5 mono">
                {uploadedFileDetails}
              </div>
            )}
            <p className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold mt-2">
              Click or drop to replace packet
            </p>
          </div>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-xs font-bold text-slate-800">Drag &amp; Drop Robot Telemetry (.mcap / ROS 2)</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Multi-modal kinematics, joint states, IMU, and odometry auto-extracted
            </p>
          </div>
        )}

        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".mcap"
          className="hidden"
          aria-label="Upload MCAP File"
        />
      </div>
    </div>
  );
};
