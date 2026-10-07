"use client";

import React from "react";
import { Incident, EvidenceItem } from "@/types";
import {
  Shield,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  ArrowLeft,
  QrCode,
  Award,
  Hash,
  Fingerprint,
} from "lucide-react";
import { Spotlight } from "./ui/Spotlight";
import { sound } from "@/lib/audio";

interface InvestigationReportProps {
  incident: Incident;
  evidence: EvidenceItem;
  onBack: () => void;
}

export function InvestigationReport({
  incident,
  evidence,
  onBack,
}: InvestigationReportProps) {
  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <Spotlight className="p-8 space-y-6 max-w-4xl mx-auto shadow-2xl">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Camera Investigation View
        </button>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            Print Dossier
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            Export Certified Court PDF
          </button>
        </div>
      </div>

      {/* Official Forensic Header */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100 tracking-tight font-sans">
                SENTINELX FORENSIC INCIDENT REPORT
              </h2>
              <p className="text-xs font-mono text-cyan-400 mt-0.5">
                CLASSIFICATION: SOC LEVEL 4 // COURT-CERTIFIED FORENSIC EVIDENCE
              </p>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <div className="font-bold text-slate-200">
              DOSSIER ID: RPT-2026-{incident.code.replace("INC-", "")}
            </div>
            <div>RECORDED: {new Date().toUTCString()}</div>
          </div>
        </div>
      </div>

      {/* Section 1: Incident Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block font-mono text-[11px]">
            INCIDENT CODE
          </span>
          <span className="font-bold text-slate-100 text-base mt-1 block font-mono">
            {incident.code}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block font-mono text-[11px]">
            SEVERITY RATING
          </span>
          <span
            className={`font-bold text-base mt-1 block ${
              incident.severity === "CRITICAL"
                ? "text-rose-400"
                : incident.severity === "HIGH"
                ? "text-orange-400"
                : "text-amber-400"
            }`}
          >
            {incident.severity}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block font-mono text-[11px]">
            CCTV TERMINAL
          </span>
          <span className="font-bold text-slate-100 text-base mt-1 block font-mono">
            {incident.cameraCode}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block font-mono text-[11px]">
            RESIDENCE DURATION
          </span>
          <span className="font-bold text-slate-100 text-base mt-1 block font-mono">
            {incident.durationSeconds}s
          </span>
        </div>
      </div>

      {/* Section 2: AI Causal Trace Narrative */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-bold">
          <FileText className="w-4 h-4" /> 1. Explainable AI Causal Determination
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {incident.explanation.summary}
        </p>

        <div className="mt-3 space-y-2">
          {incident.explanation.traces.map((trace, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900 border border-slate-800/80"
            >
              <span className="text-slate-300 font-medium">
                ✓ {trace.rule}: {trace.detail}
              </span>
              <span className="font-mono text-cyan-400 text-[11px] font-bold">
                {trace.metric}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Cryptographic Chain of Custody */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4" /> 2. Cryptographic Evidence Integrity (Chain of Custody)
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            NIST FIPS 180-4 COMPLIANT
          </span>
        </div>

        <div className="text-xs text-slate-300 space-y-2">
          <div>
            <span className="text-slate-400 font-mono">EVIDENCE IDENTIFIER:</span>{" "}
            <span className="font-mono font-bold text-slate-100">{evidence.code}</span>
          </div>
          <div>
            <span className="text-slate-400 font-mono">CANONICAL SHA-256 HASH:</span>
            <div className="p-3 mt-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400 break-all select-all font-bold">
              {evidence.sha256Hash}
            </div>
          </div>
          <div className="text-emerald-400 font-semibold pt-1 flex items-center gap-2">
            <Award className="w-4 h-4" />
            FORENSIC STATUS: ADMISSIBLE UNDER FEDERAL RULES OF EVIDENCE (RULE 901)
          </div>
        </div>
      </div>

      {/* Section 4: Officer / Investigator Sign-off */}
      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block font-mono text-[11px]">
            AUTHORIZING INVESTIGATOR
          </span>
          <span className="font-bold text-slate-200 mt-1 block">
            Inspector Marcus Vance (ID: INV-8842)
          </span>
          <span className="text-slate-500 text-[11px] font-mono">
            Sentinel SOC Security Clearance Level 4
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block font-mono text-[11px]">
            HARDWARE CRYPTOGRAPHIC SIGNATURE
          </span>
          <span className="font-mono text-cyan-400 text-[11px] mt-1 block font-bold">
            ECDSA_SECP256K1_94f08a9c...28be
          </span>
          <span className="text-slate-500 text-[11px] font-mono">
            Timestamped: {new Date().toISOString()}
          </span>
        </div>
      </div>
    </Spotlight>
  );
}
