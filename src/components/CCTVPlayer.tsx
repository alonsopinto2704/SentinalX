"use client";

import React, { useRef, useEffect, useState } from "react";
import { Camera, Incident, SmartZone } from "@/types";
import {
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  AlertTriangle,
  Maximize2,
  Crosshair,
  Volume2,
  VolumeX,
  Sliders,
  Tv,
  Flame,
  Moon,
  Sparkles,
} from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { sound } from "@/lib/audio";

interface CCTVPlayerProps {
  camera: Camera;
  incident?: Incident | null;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  onOpenZoneEditor?: () => void;
  customVideoUrl?: string | null;
}

type VisionMode = "optical" | "thermal" | "nightvision";

export function CCTVPlayer({
  camera,
  incident,
  privacyMode,
  onTogglePrivacy,
  currentTime,
  onSeek,
  onOpenZoneEditor,
  customVideoUrl,
}: CCTVPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showDetections, setShowDetections] = useState(true);
  const [visionMode, setVisionMode] = useState<VisionMode>("optical");
  const [hasGlitch, setHasGlitch] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  // Toggle sound mute
  const toggleAudio = () => {
    sound.enabled = audioMuted;
    setAudioMuted(!audioMuted);
    sound.playClick();
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Canvas CCTV Surveillance Render Loop
  useEffect(() => {
    let animationId: number;
    let localTime = currentTime;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. Base Surveillance Environment
      if (visionMode === "thermal") {
        // FLIR Thermal Ironbow palette
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#08001a");
        grad.addColorStop(0.5, "#220038");
        grad.addColorStop(1, "#3c004a");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (visionMode === "nightvision") {
        // Night Vision Green Phosphor
        ctx.fillStyle = "#021206";
        ctx.fillRect(0, 0, width, height);
      } else {
        // Deep Obsidian Tactical
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#070a12");
        grad.addColorStop(1, "#0f1424");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Architectural Perspective Lines
      ctx.strokeStyle =
        visionMode === "nightvision"
          ? "rgba(34, 197, 94, 0.15)"
          : visionMode === "thermal"
          ? "rgba(236, 72, 153, 0.15)"
          : "rgba(30, 41, 59, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.68);
      ctx.lineTo(width, height * 0.68);
      ctx.moveTo(width * 0.28, 0);
      ctx.lineTo(width * 0.1, height * 0.68);
      ctx.moveTo(width * 0.72, 0);
      ctx.lineTo(width * 0.9, height * 0.68);
      ctx.stroke();

      // Floor Grid Tiles
      for (let i = 1; i <= 6; i++) {
        const y = height * 0.68 + i * (height * 0.052);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Smart Security Zones
      if (showZones && camera.zones) {
        camera.zones.forEach((zone) => {
          if (!zone.points || zone.points.length < 3) return;
          ctx.beginPath();
          ctx.moveTo(zone.points[0].x * width, zone.points[0].y * height);
          for (let p = 1; p < zone.points.length; p++) {
            ctx.lineTo(zone.points[p].x * width, zone.points[p].y * height);
          }
          ctx.closePath();

          ctx.fillStyle =
            zone.type === "RESTRICTED"
              ? "rgba(239, 68, 68, 0.18)"
              : "rgba(59, 130, 246, 0.12)";
          ctx.fill();

          ctx.strokeStyle = zone.type === "RESTRICTED" ? "#EF4444" : "#3B82F6";
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 4]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Zone Tag Badge
          const firstPt = zone.points[0];
          const tagX = firstPt.x * width;
          const tagY = firstPt.y * height - 22;

          ctx.fillStyle = zone.type === "RESTRICTED" ? "#EF4444" : "#3B82F6";
          ctx.fillRect(tagX, tagY, 160, 20);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 10px monospace";
          ctx.fillText(`ZONE: ${zone.name.toUpperCase()}`, tagX + 6, tagY + 14);
        });
      }

      // 3. Simulated Moving Objects & Bounding Boxes
      if (showDetections) {
        const t = (localTime % 30) / 30; // loop progress

        if (camera.code === "CAM-03") {
          // Person #17 entering restricted turnstile
          const personX = width * (0.2 + t * 0.5);
          const personY = height * (0.42 + Math.sin(t * Math.PI) * 0.04);
          const boxW = width * 0.085;
          const boxH = height * 0.34;
          const isInsideRestricted = personX > width * 0.45;

          // Thermal / NVG / Optical Body Silhouette
          if (visionMode === "thermal") {
            ctx.fillStyle = isInsideRestricted ? "#f97316" : "#fbbf24";
          } else if (visionMode === "nightvision") {
            ctx.fillStyle = "#4ade80";
          } else {
            ctx.fillStyle = "#334155";
          }

          // Head & Torso
          ctx.beginPath();
          ctx.ellipse(
            personX + boxW / 2,
            personY + boxH * 0.18,
            boxW * 0.28,
            boxH * 0.17,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
          ctx.fillRect(
            personX + boxW * 0.22,
            personY + boxH * 0.35,
            boxW * 0.56,
            boxH * 0.62
          );

          // Face Region (Privacy Redaction or Direct)
          if (privacyMode) {
            ctx.fillStyle = "rgba(71, 85, 105, 0.9)";
            ctx.filter = "blur(8px)";
            ctx.beginPath();
            ctx.arc(
              personX + boxW / 2,
              personY + boxH * 0.18,
              boxW * 0.32,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.filter = "none";

            // Redacted Stamp
            ctx.fillStyle = "#10B981";
            ctx.font = "bold 9px monospace";
            ctx.fillText("[REDACTED]", personX - 2, personY + 2);
          }

          // Bounding Box
          ctx.strokeStyle = isInsideRestricted ? "#EF4444" : "#06B6D4";
          ctx.lineWidth = 2;
          ctx.strokeRect(personX, personY, boxW, boxH);

          // Corner Reticle Accents
          const cornerLen = 8;
          ctx.lineWidth = 3;
          ctx.strokeStyle = isInsideRestricted ? "#EF4444" : "#06B6D4";
          // Top-Left
          ctx.beginPath();
          ctx.moveTo(personX, personY + cornerLen);
          ctx.lineTo(personX, personY);
          ctx.lineTo(personX + cornerLen, personY);
          ctx.stroke();
          // Bottom-Right
          ctx.beginPath();
          ctx.moveTo(personX + boxW, personY + boxH - cornerLen);
          ctx.lineTo(personX + boxW, personY + boxH);
          ctx.lineTo(personX + boxW - cornerLen, personY + boxH);
          ctx.stroke();

          // Bounding Box Label
          ctx.fillStyle = isInsideRestricted ? "#EF4444" : "#06B6D4";
          ctx.fillRect(personX, personY - 20, 130, 20);
          ctx.fillStyle = "#000000";
          ctx.font = "bold 11px monospace";
          ctx.fillText(`Person #17 [94%]`, personX + 4, personY - 6);

          // Velocity & Track Telemetry
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "9px monospace";
          ctx.fillText(
            `v: 1.8m/s | track: #17`,
            personX,
            personY + boxH + 14
          );

          // Intrusion Alert Banner if breached
          if (isInsideRestricted) {
            ctx.fillStyle = "rgba(239, 68, 68, 0.88)";
            ctx.fillRect(width * 0.22, height * 0.08, width * 0.56, 36);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 13px monospace";
            ctx.textAlign = "center";
            ctx.fillText(
              "🚨 ALERT: RESTRICTED ZONE INTRUSION DETECTED",
              width * 0.5,
              height * 0.08 + 23
            );
            ctx.textAlign = "left";
          }
        } else if (camera.code === "CAM-02") {
          // Abandoned Backpack
          const bagX = width * 0.48;
          const bagY = height * 0.62;
          const bagW = width * 0.075;
          const bagH = height * 0.13;

          ctx.fillStyle = visionMode === "thermal" ? "#f43f5e" : "#1e293b";
          ctx.fillRect(bagX, bagY, bagW, bagH);

          ctx.strokeStyle = "#EF4444";
          ctx.lineWidth = 2;
          ctx.strokeRect(bagX, bagY, bagW, bagH);

          ctx.fillStyle = "#EF4444";
          ctx.fillRect(bagX, bagY - 20, 115, 20);
          ctx.fillStyle = "#000000";
          ctx.font = "bold 11px monospace";
          ctx.fillText("Bag #09 [96%]", bagX + 4, bagY - 6);

          ctx.fillStyle = "#EF4444";
          ctx.font = "bold 11px monospace";
          ctx.fillText("STATIONARY: 124s", bagX, bagY + bagH + 16);
        } else {
          // Crowd / Multi-Track
          for (let s = 0; s < 3; s++) {
            const pX = width * (0.16 + s * 0.25 + t * 0.1);
            const pY = height * 0.5;
            const bW = width * 0.065;
            const bH = height * 0.28;

            ctx.strokeStyle = "#06B6D4";
            ctx.lineWidth = 1.5;
            ctx.strokeRect(pX, pY, bW, bH);
            ctx.fillStyle = "#06B6D4";
            ctx.fillRect(pX, pY - 16, 90, 16);
            ctx.fillStyle = "#000000";
            ctx.font = "9px monospace";
            ctx.fillText(`Person #${s + 20}`, pX + 3, pY - 4);

            if (privacyMode) {
              ctx.fillStyle = "rgba(71, 85, 105, 0.9)";
              ctx.beginPath();
              ctx.arc(pX + bW / 2, pY + bH * 0.16, bW * 0.35, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 4. Tactical CCTV HUD (On-Screen Display)
      ctx.fillStyle = "rgba(11, 15, 25, 0.85)";
      ctx.fillRect(0, 0, width, 34);

      ctx.fillStyle =
        visionMode === "nightvision"
          ? "#4ade80"
          : visionMode === "thermal"
          ? "#f43f5e"
          : "#06B6D4";
      ctx.font = "bold 12px monospace";
      ctx.fillText(
        `[REC] ● ${camera.code} // ${camera.name.toUpperCase()} [${visionMode.toUpperCase()}]`,
        12,
        22
      );

      ctx.fillStyle = "#94A3B8";
      ctx.font = "11px monospace";
      ctx.textAlign = "right";
      const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
      ctx.fillText(`${nowStr} UTC | ${camera.resolution}`, width - 12, 22);
      ctx.textAlign = "left";

      // CRT Scanline Pattern
      ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
      for (let sl = 0; sl < height; sl += 4) {
        ctx.fillRect(0, sl, width, 1.5);
      }

      // Simulated CCTV Grain / Static
      if (hasGlitch) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        for (let g = 0; g < 400; g++) {
          ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            2,
            2
          );
        }
      }
    };

    render();

    if (isPlaying) {
      const interval = setInterval(() => {
        localTime += 0.25;
        render();
      }, 250);
      return () => clearInterval(interval);
    }
  }, [
    camera,
    isPlaying,
    showZones,
    showDetections,
    privacyMode,
    currentTime,
    visionMode,
    hasGlitch,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col rounded-3xl border border-slate-800/90 bg-[#0A0E17] overflow-hidden shadow-2xl backdrop-blur-2xl"
    >
      {/* Top Tactical Controls Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-mono font-bold text-slate-100">{camera.code}</span>
          <span className="text-slate-500 font-mono">/</span>
          <span className="text-slate-300">{camera.location}</span>
        </div>

        {/* Vision Spectrum & Filter Controls */}
        <div className="flex items-center gap-2">
          {/* Vision Modes Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-[11px]">
            <button
              onClick={() => {
                sound.playClick();
                setVisionMode("optical");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                visionMode === "optical"
                  ? "bg-cyan-500/20 text-cyan-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tv className="w-3 h-3" /> Optical
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setVisionMode("thermal");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                visionMode === "thermal"
                  ? "bg-pink-500/20 text-pink-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3 h-3" /> Thermal FLIR
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setVisionMode("nightvision");
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                visionMode === "nightvision"
                  ? "bg-emerald-500/20 text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Moon className="w-3 h-3" /> NVG Night
            </button>
          </div>

          {/* Zones Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setShowZones(!showZones);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              showZones
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {showZones ? "ZONES: ON" : "ZONES: OFF"}
          </button>

          {/* AI BBox Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setShowDetections(!showDetections);
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              showDetections
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {showDetections ? "AI BBOX: ON" : "AI BBOX: OFF"}
          </button>

          {/* Privacy Redaction Toggle */}
          <button
            onClick={() => {
              sound.playVerify();
              onTogglePrivacy();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              privacyMode
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {privacyMode ? "PRIVACY: BLUR" : "PRIVACY: RAW"}
          </button>

          {/* Edit Zones Button */}
          {onOpenZoneEditor && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenZoneEditor();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Edit Zones
            </button>
          )}

          {/* Audio Feedback Toggle */}
          <button
            onClick={toggleAudio}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={audioMuted ? "Unmute audio" : "Mute audio"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main CCTV Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {customVideoUrl ? (
          <video
            src={customVideoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full object-contain cursor-crosshair"
          />
        )}

        {/* Telemetry Reticle in Lower Right */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 border border-slate-700/60 text-xs font-mono text-cyan-400 backdrop-blur-md pointer-events-none">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>INFERENCE: 21.4ms</span>
          <span className="text-slate-600">|</span>
          <span>FPS: {camera.fps}</span>
        </div>

        {/* Glitch CRT Simulation Button */}
        <button
          onClick={() => {
            sound.playClick();
            setHasGlitch(!hasGlitch);
          }}
          className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-mono border backdrop-blur-md transition-colors ${
            hasGlitch
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
              : "bg-black/60 text-slate-400 border-slate-700/60 hover:text-white"
          }`}
        >
          {hasGlitch ? "CRT NOISE: ACTIVE" : "CRT NOISE"}
        </button>
      </div>

      {/* Scrubber & Player Controls Bar */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-4">
        <button
          onClick={() => {
            sound.playClick();
            setIsPlaying(!isPlaying);
          }}
          aria-label={isPlaying ? "Pause CCTV" : "Play CCTV"}
          className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <span className="text-xs font-mono text-slate-400 min-w-14">
          {formatTimestamp(currentTime)} / 10:00
        </span>

        {/* Timeline Slider with Interactive Incident Pins */}
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min={0}
            max={600}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          {camera.code === "CAM-03" && (
            <div
              title="14:32:18 - Restricted Area Intrusion (Jump)"
              style={{ left: `${(154 / 600) * 100}%` }}
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-900 shadow-lg shadow-rose-500/50 cursor-pointer hover:scale-150 transition-transform animate-ping"
              onClick={() => {
                sound.playAlert();
                onSeek(154);
              }}
            />
          )}
          {camera.code === "CAM-02" && (
            <div
              title="13:58:04 - Abandoned Backpack (Jump)"
              style={{ left: `${(98 / 600) * 100}%` }}
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-slate-900 shadow-lg shadow-rose-500/50 cursor-pointer hover:scale-150 transition-transform"
              onClick={() => {
                sound.playAlert();
                onSeek(98);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
