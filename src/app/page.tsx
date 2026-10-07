"use client";

import React, { useState } from "react";
import {
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_EVIDENCE,
} from "@/data/mockData";
import { Camera, Incident, EvidenceItem, SmartZone } from "@/types";
import { CCTVPlayer } from "@/components/CCTVPlayer";
import { AIExplanationPanel } from "@/components/AIExplanationPanel";
import { EvidenceViewer } from "@/components/EvidenceViewer";
import { AISearchConsole } from "@/components/AISearchConsole";
import { InvestigationReport } from "@/components/InvestigationReport";
import { ZoneDrawerModal } from "@/components/ZoneDrawerModal";
import { Spotlight } from "@/components/ui/Spotlight";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { Marquee } from "@/components/ui/Marquee";
import { sound } from "@/lib/audio";
import {
  Shield,
  Video,
  AlertTriangle,
  FileCheck,
  Search,
  FileText,
  Sliders,
  Upload,
  PlayCircle,
  Eye,
  EyeOff,
  Layers,
  ChevronRight,
  Sparkles,
  Lock,
  Activity,
  Cpu,
  Radio,
  Bell,
  CheckCircle2,
  X,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ActiveTab =
  | "dashboard"
  | "cameras"
  | "incidents"
  | "evidence"
  | "ai-search"
  | "report";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);

  // Selected State
  const [selectedCamera, setSelectedCamera] = useState<Camera>(INITIAL_CAMERAS[2]); // CAM-03
  const [selectedIncident, setSelectedIncident] = useState<Incident>(INITIAL_INCIDENTS[0]); // INC-00042
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem>(INITIAL_EVIDENCE[0]);

  // Player & Controls State
  const [privacyMode, setPrivacyMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(154);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  // Zone Drawer Modal State
  const [isZoneEditorOpen, setIsZoneEditorOpen] = useState(false);

  // Guided Investigation Story Step (Phase 10 ⭐)
  const [demoStep, setDemoStep] = useState<number>(1);

  // Quick Alert Toast Notification
  const [showAlertBanner, setShowAlertBanner] = useState<boolean>(true);

  const handleSelectCamera = (cam: Camera) => {
    sound.playClick();
    setSelectedCamera(cam);
    const relatedIncident = incidents.find((i) => i.cameraId === cam.id);
    if (relatedIncident) {
      setSelectedIncident(relatedIncident);
      setCurrentTime(relatedIncident.timestampSeconds);
      const evd = evidenceList.find((e) => e.incidentId === relatedIncident.id);
      if (evd) setSelectedEvidence(evd);
    }
    setActiveTab("cameras");
  };

  const handleSelectIncident = (inc: Incident) => {
    sound.playClick();
    setSelectedIncident(inc);
    setCurrentTime(inc.timestampSeconds);
    const cam = cameras.find((c) => c.id === inc.cameraId);
    if (cam) setSelectedCamera(cam);
    const evd = evidenceList.find((e) => e.incidentId === inc.id);
    if (evd) setSelectedEvidence(evd);
    setActiveTab("cameras");
  };

  const handleGenerateReport = (evidenceId: string) => {
    sound.playVerify();
    const evd = evidenceList.find((e) => e.id === evidenceId);
    if (evd) setSelectedEvidence(evd);
    setActiveTab("report");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playVerify();
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setActiveTab("cameras");
    }
  };

  const handleSaveZones = (updatedZones: SmartZone[]) => {
    const updatedCam = { ...selectedCamera, zones: updatedZones };
    setSelectedCamera(updatedCam);
    setCameras(cameras.map((c) => (c.id === updatedCam.id ? updatedCam : c)));
  };

  const advanceDemoTour = () => {
    sound.playClick();
    if (demoStep === 1) {
      handleSelectCamera(INITIAL_CAMERAS[2]);
      setDemoStep(2);
    } else if (demoStep === 2) {
      setCurrentTime(154);
      setDemoStep(3);
    } else if (demoStep === 3) {
      setDemoStep(4);
    } else if (demoStep === 4) {
      setActiveTab("evidence");
      setDemoStep(5);
    } else if (demoStep === 5) {
      setActiveTab("ai-search");
      setDemoStep(6);
    } else if (demoStep === 6) {
      setActiveTab("report");
      setDemoStep(7);
    } else {
      setActiveTab("dashboard");
      setDemoStep(1);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Layers },
    { id: "cameras", label: "Camera Feeds", icon: Video },
    { id: "incidents", label: "Incidents", icon: AlertTriangle, count: incidents.length },
    { id: "evidence", label: "Evidence Vault", icon: FileCheck },
    { id: "ai-search", label: "AI Investigation", icon: Search },
    { id: "report", label: "Forensic Reports", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-[#07090E] text-slate-100 font-sans overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient Radial Spotlight Mesh */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_-10%,rgba(6,182,212,0.12),rgba(255,255,255,0))]" />

      {/* Subtle Tactical Grid Pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/80 bg-[#0A0D16]/95 backdrop-blur-2xl flex flex-col justify-between shrink-0 z-20">
        <div>
          {/* Logo & Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-lg shadow-cyan-500/10">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-extrabold text-sm tracking-wider text-slate-100">
                  SENTINEL<span className="text-cyan-400">X</span>
                </h1>
                <p className="text-[10px] font-mono text-cyan-500/80 tracking-widest uppercase">
                  AI VISION DEFENSE
                </p>
              </div>
            </div>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          {/* Navigation Links with Framer Motion LayoutId */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveTab(item.id as ActiveTab);
                  }}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-cyan-300 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarPill"
                      className="absolute inset-0 bg-cyan-500/15 border border-cyan-500/30 rounded-xl shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    {item.label}
                  </span>
                  {item.count !== undefined && (
                    <span className="relative z-10 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Upload & User Profile */}
        <div className="p-3.5 border-t border-slate-800/80 space-y-3">
          <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white cursor-pointer transition-colors shadow-sm">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload CCTV Clip</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-center justify-between">
            <div>
              <span className="block text-xs font-bold text-slate-200">
                Inspector M. Vance
              </span>
              <span className="block text-[10px] font-mono text-slate-400">
                ID: INV-8842 // SOC-4
              </span>
            </div>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden z-10">
        {/* Continuous Telemetry Marquee Banner */}
        <div className="bg-slate-950/80 border-b border-slate-800/90 py-1 px-4 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <Marquee className="flex-1">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              SOC STREAM: ONLINE
            </span>
            <span className="text-slate-600">•</span>
            <span>CAM-01 [GATE NORTH] 1080p 30fps</span>
            <span className="text-slate-600">•</span>
            <span>CAM-02 [LOBBY] 1080p 30fps</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400 font-bold">CAM-03 [ENTRANCE] 4K 60fps 🚨 ALERT ACTIVE</span>
            <span className="text-slate-600">•</span>
            <span>CAM-04 [LOADING BAY] 1080p 30fps</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300 font-mono">YOLOv8 INFERENCE: 21.4ms</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">SHA-256 INTEGRITY: 100% VALID</span>
          </Marquee>
        </div>

        {/* Guided Investigation Story Tour Bar (Phase 10 ⭐) */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border-b border-cyan-500/20 flex items-center justify-between text-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono font-bold text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              INVESTIGATION STORY TOUR:
            </span>
            <span className="text-slate-200 font-medium">
              {demoStep === 1 && "Step 1: Inspect SOC Dashboard & Real-Time Incident Status"}
              {demoStep === 2 && "Step 2: Inspect Camera 03 (Turnstiles Intrusion Alert)"}
              {demoStep === 3 && "Step 3: Scrub Timeline to Exact Breach Timestamp (14:32:18)"}
              {demoStep === 4 && "Step 4: Review Explainable AI (XAI) Causal Logic"}
              {demoStep === 5 && "Step 5: Verify SHA-256 Cryptographic Hash & Tamper-Proofing"}
              {demoStep === 6 && "Step 6: Natural Language Search Across CCTV Cameras"}
              {demoStep === 7 && "Step 7: Generate Official Forensic Incident Report"}
            </span>
          </div>

          <button
            onClick={advanceDemoTour}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors shadow-md shadow-cyan-500/20"
          >
            <span>Next Step ({demoStep}/7)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Real-Time Critical Alert Banner */}
        {showAlertBanner && (
          <div className="relative mx-6 mt-4 p-3 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900/80 border border-rose-500/40 flex items-center justify-between shadow-xl">
            <BorderBeam colorFrom="#ef4444" colorTo="#f97316" size={240} duration={6} />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 animate-pulse">
                <Bell className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-rose-400 uppercase font-mono mr-2">
                  🚨 CRITICAL EVENT DETECTED:
                </span>
                <span className="text-slate-200">
                  Restricted Area Intrusion at CAM-03 (Confidence: 94%, Dwell: 18.4s)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  handleSelectCamera(INITIAL_CAMERAS[2]);
                }}
                className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs font-mono transition-colors"
              >
                Investigate Now →
              </button>
              <button
                onClick={() => setShowAlertBanner(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Screen View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {/* TAB 1: DASHBOARD BENTO GRID */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Modern Bento Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Spotlight className="p-5">
                    <span className="text-xs font-mono text-slate-400 block font-bold">
                      ACTIVE MONITORED FEEDS
                    </span>
                    <div className="text-3xl font-extrabold font-mono text-slate-100 mt-2">
                      4 / 4
                    </div>
                    <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All streams nominal (0 loss)
                    </span>
                  </Spotlight>

                  <Spotlight className="p-5" fill="rgba(239, 68, 68, 0.15)">
                    <span className="text-xs font-mono text-slate-400 block font-bold">
                      CRITICAL ALERTS
                    </span>
                    <div className="text-3xl font-extrabold font-mono text-rose-500 mt-2">
                      1
                    </div>
                    <span className="text-[11px] text-rose-400 mt-1 font-semibold">
                      CAM-02 (Abandoned Baggage)
                    </span>
                  </Spotlight>

                  <Spotlight className="p-5" fill="rgba(249, 115, 22, 0.15)">
                    <span className="text-xs font-mono text-slate-400 block font-bold">
                      HIGH SEVERITY BREACHES
                    </span>
                    <div className="text-3xl font-extrabold font-mono text-orange-500 mt-2">
                      2
                    </div>
                    <span className="text-[11px] text-orange-400 mt-1 font-semibold">
                      CAM-03 Perimeter & CAM-04 Sprint
                    </span>
                  </Spotlight>

                  <Spotlight className="p-5" fill="rgba(16, 185, 129, 0.15)">
                    <span className="text-xs font-mono text-slate-400 block font-bold">
                      EVIDENCE INTEGRITY AUDIT
                    </span>
                    <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
                      100%
                    </div>
                    <span className="text-[11px] text-emerald-400 mt-1 font-semibold">
                      SHA-256 Hashes Verified Unmodified
                    </span>
                  </Spotlight>
                </div>

                {/* 2x2 Tactical CCTV Grid with BorderBeam on Alert Feed */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-200 tracking-wide">
                      Real-Time Tactical CCTV Grid Matrix
                    </h3>
                    <span className="text-xs font-mono text-cyan-400">
                      CLICK FEED TO EXPAND FULL INVESTIGATION
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cameras.map((cam) => {
                      const isAlert = cam.status === "ALERT";
                      return (
                        <div
                          key={cam.id}
                          onClick={() => handleSelectCamera(cam)}
                          className={`group relative rounded-3xl border ${
                            isAlert
                              ? "border-rose-500/60 bg-[#0C101C]"
                              : "border-slate-800 hover:border-cyan-500/50 bg-[#0A0E17]"
                          } p-4 cursor-pointer transition-all shadow-xl hover:shadow-cyan-500/10 overflow-hidden`}
                        >
                          {isAlert && (
                            <BorderBeam
                              colorFrom="#ef4444"
                              colorTo="#f97316"
                              size={280}
                              duration={6}
                            />
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2.5 text-xs">
                              <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                  isAlert ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                                }`}
                              />
                              <span className="font-mono font-bold text-slate-200">
                                {cam.code}
                              </span>
                              <span className="text-slate-400 font-medium">
                                ({cam.name})
                              </span>
                            </div>
                            {isAlert ? (
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold">
                                🚨 ACTIVE INTRUSION
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                                {cam.resolution}
                              </span>
                            )}
                          </div>

                          <div className="aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                            <div className="text-center">
                              <Video
                                className={`w-10 h-10 mx-auto mb-2 transition-colors ${
                                  isAlert ? "text-rose-500" : "text-slate-600 group-hover:text-cyan-400"
                                }`}
                              />
                              <span className="text-xs font-mono text-slate-400 block font-medium">
                                {cam.location}
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400 mt-1 inline-block">
                                Click to Enter Terminal →
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Detections List */}
                <Spotlight className="p-6">
                  <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
                    <span>Recent Automated Incident Detections</span>
                    <span className="text-xs font-mono text-slate-400">
                      TOTAL RECORDED: {incidents.length}
                    </span>
                  </h3>
                  <div className="space-y-2.5">
                    {incidents.map((inc) => (
                      <div
                        key={inc.id}
                        onClick={() => handleSelectIncident(inc)}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              inc.severity === "CRITICAL"
                                ? "bg-rose-500 animate-pulse"
                                : inc.severity === "HIGH"
                                ? "bg-orange-500"
                                : "bg-amber-500"
                            }`}
                          />
                          <div>
                            <span className="font-bold text-slate-200 text-sm">
                              {inc.title}
                            </span>
                            <span className="font-mono text-slate-400 ml-2">
                              [{inc.code}]
                            </span>
                            <span className="text-slate-400 block text-xs mt-0.5">
                              {inc.cameraCode} // {inc.cameraLocation}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 font-mono">
                          <span className="text-slate-400">{inc.timestamp} UTC</span>
                          <span className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                            {Math.round(inc.confidence * 100)}% Conf
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Spotlight>
              </motion.div>
            )}

            {/* TAB 2: CAMERAS & INVESTIGATION VIEW */}
            {activeTab === "cameras" && (
              <motion.div
                key="cameras"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* CCTV Video Player & XAI Panel (2 Cols) */}
                <div className="lg:col-span-2 space-y-6">
                  <CCTVPlayer
                    camera={selectedCamera}
                    incident={selectedIncident}
                    privacyMode={privacyMode}
                    onTogglePrivacy={() => setPrivacyMode(!privacyMode)}
                    currentTime={currentTime}
                    onSeek={setCurrentTime}
                    onOpenZoneEditor={() => setIsZoneEditorOpen(true)}
                    customVideoUrl={customVideoUrl}
                  />

                  {selectedIncident && (
                    <AIExplanationPanel incident={selectedIncident} />
                  )}
                </div>

                {/* Camera Selector & Zones Sidebar (1 Col) */}
                <div className="space-y-5">
                  <Spotlight className="p-5 space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      Switch CCTV Terminal
                    </h3>
                    <div className="space-y-2">
                      {cameras.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSelectCamera(c)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex items-center justify-between ${
                            selectedCamera.id === c.id
                              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold shadow-md shadow-cyan-500/10"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                          }`}
                        >
                          <div>
                            <div className="font-mono text-sm">{c.code}</div>
                            <div className="text-slate-400 text-[11px] mt-0.5">
                              {c.name}
                            </div>
                          </div>
                          {c.status === "ALERT" && (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </Spotlight>

                  {/* Smart Zones Manager */}
                  <Spotlight className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Smart Security Zones
                      </h3>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setIsZoneEditorOpen(true);
                        }}
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Edit Zones
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {selectedCamera.zones.map((zone) => (
                        <div
                          key={zone.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-200">
                              {zone.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                                zone.type === "RESTRICTED"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              }`}
                            >
                              {zone.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            Dwell Limit: {zone.dwellThresholdSeconds}s
                          </div>
                        </div>
                      ))}
                    </div>
                  </Spotlight>

                  {/* Quick Action to Evidence Vault */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab("evidence");
                    }}
                    className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-400 flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <FileCheck className="w-4 h-4" />
                    Inspect Cryptographic Evidence & Hash
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: INCIDENTS FEED */}
            {activeTab === "incidents" && (
              <motion.div
                key="incidents"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold text-slate-100">
                  Forensic Incidents & Risk Prioritization
                </h2>
                <div className="grid grid-cols-1 gap-3.5">
                  {incidents.map((inc) => (
                    <Spotlight
                      key={inc.id}
                      className="p-5 cursor-pointer"
                    >
                      <div
                        onClick={() => handleSelectIncident(inc)}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                inc.severity === "CRITICAL"
                                  ? "bg-rose-500 animate-pulse"
                                  : inc.severity === "HIGH"
                                  ? "bg-orange-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            <span className="font-extrabold text-slate-100 text-sm">
                              {inc.title}
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-950 text-cyan-400 border border-slate-800">
                              {inc.code}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-slate-400">
                            {inc.timestamp} UTC
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                          {inc.explanation.summary}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                          <span>Camera: {inc.cameraCode} ({inc.cameraLocation})</span>
                          <span className="text-cyan-400 font-bold">
                            Confidence: {Math.round(inc.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </Spotlight>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB 4: EVIDENCE VAULT */}
            {activeTab === "evidence" && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <EvidenceViewer
                  evidence={selectedEvidence}
                  onGenerateReport={handleGenerateReport}
                />
              </motion.div>
            )}

            {/* TAB 5: AI NATURAL LANGUAGE SEARCH */}
            {activeTab === "ai-search" && (
              <motion.div
                key="ai-search"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <AISearchConsole
                  incidents={incidents}
                  onSelectIncident={(inc) => {
                    handleSelectIncident(inc);
                    setActiveTab("cameras");
                  }}
                />
              </motion.div>
            )}

            {/* TAB 6: FORENSIC INVESTIGATION REPORT */}
            {activeTab === "report" && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <InvestigationReport
                  incident={selectedIncident}
                  evidence={selectedEvidence}
                  onBack={() => setActiveTab("cameras")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Zone Drawer Modal */}
      {isZoneEditorOpen && (
        <ZoneDrawerModal
          cameraCode={selectedCamera.code}
          zones={selectedCamera.zones}
          onSaveZones={handleSaveZones}
          onClose={() => setIsZoneEditorOpen(false)}
        />
      )}
    </div>
  );
}
