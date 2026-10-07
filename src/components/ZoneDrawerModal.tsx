"use client";

import React, { useState } from "react";
import { SmartZone } from "@/types";
import { Shield, Plus, Trash2, Check, X, Sliders } from "lucide-react";
import { sound } from "@/lib/audio";

interface ZoneDrawerModalProps {
  cameraCode: string;
  zones: SmartZone[];
  onSaveZones: (zones: SmartZone[]) => void;
  onClose: () => void;
}

export function ZoneDrawerModal({
  cameraCode,
  zones,
  onSaveZones,
  onClose,
}: ZoneDrawerModalProps) {
  const [currentZones, setCurrentZones] = useState<SmartZone[]>(zones);
  const [activeZoneIndex, setActiveZoneIndex] = useState<number>(0);

  const activeZone = currentZones[activeZoneIndex];

  const handleUpdateActiveZone = (updated: Partial<SmartZone>) => {
    const next = [...currentZones];
    next[activeZoneIndex] = { ...next[activeZoneIndex], ...updated };
    setCurrentZones(next);
  };

  const handleAddNewZone = () => {
    sound.playClick();
    const newZone: SmartZone = {
      id: `z-${Date.now()}`,
      name: `Custom Security Perimeter #${currentZones.length + 1}`,
      type: "RESTRICTED",
      color: "#EF4444",
      dwellThresholdSeconds: 5.0,
      points: [
        { x: 0.2, y: 0.2 },
        { x: 0.8, y: 0.2 },
        { x: 0.8, y: 0.8 },
        { x: 0.2, y: 0.8 },
      ],
    };
    setCurrentZones([...currentZones, newZone]);
    setActiveZoneIndex(currentZones.length);
  };

  const handleDeleteActiveZone = () => {
    sound.playClick();
    if (currentZones.length <= 1) return;
    const next = currentZones.filter((_, idx) => idx !== activeZoneIndex);
    setCurrentZones(next);
    setActiveZoneIndex(Math.max(0, activeZoneIndex - 1));
  };

  const handleSave = () => {
    sound.playVerify();
    onSaveZones(currentZones);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0B0F19] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Smart Security Zone Configuration — {cameraCode}
              </h3>
              <p className="text-xs text-slate-400">
                Define virtual spatial barriers and dwell dwell-time thresholds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zone List & Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {currentZones.map((z, idx) => (
            <button
              key={z.id}
              onClick={() => {
                sound.playClick();
                setActiveZoneIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium shrink-0 transition-all ${
                activeZoneIndex === idx
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {z.name}
            </button>
          ))}
          <button
            onClick={handleAddNewZone}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Zone
          </button>
        </div>

        {/* Active Zone Editor Form */}
        {activeZone && (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-mono">
                  ZONE DESIGNATION NAME
                </label>
                <input
                  type="text"
                  value={activeZone.name}
                  onChange={(e) => handleUpdateActiveZone({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono">
                  BARRIER CLASSIFICATION
                </label>
                <select
                  value={activeZone.type}
                  onChange={(e) =>
                    handleUpdateActiveZone({
                      type: e.target.value as "RESTRICTED" | "MONITORED" | "NORMAL",
                      color: e.target.value === "RESTRICTED" ? "#EF4444" : "#3B82F6",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="RESTRICTED">RESTRICTED (🔴 High Severity Breach)</option>
                  <option value="MONITORED">MONITORED (🔵 Normal Passage)</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono">
                  DWELL TRIGGER THRESHOLD: {activeZone.dwellThresholdSeconds} SECONDS
                </span>
                <span className="text-[11px] text-cyan-400">
                  Alert fires when subject lingers longer than threshold
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={activeZone.dwellThresholdSeconds}
                onChange={(e) =>
                  handleUpdateActiveZone({
                    dwellThresholdSeconds: Number(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Polygon Vertex Count: {activeZone.points.length} coordinates mapped
              </span>
              {currentZones.length > 1 && (
                <button
                  onClick={handleDeleteActiveZone}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Zone
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" /> Save Zone Matrix
          </button>
        </div>
      </div>
    </div>
  );
}
