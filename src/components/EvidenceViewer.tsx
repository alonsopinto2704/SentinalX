"use client";

import React, { useState } from "react";
import { EvidenceItem } from "@/types";
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  FileText,
  CheckCircle2,
  AlertOctagon,
  Fingerprint,
  QrCode,
} from "lucide-react";
import { Spotlight } from "./ui/Spotlight";
import { sound } from "@/lib/audio";

interface EvidenceViewerProps {
  evidence: EvidenceItem;
  onGenerateReport: (evidenceId: string) => void;
}

export function EvidenceViewer({ evidence, onGenerateReport }: EvidenceViewerProps) {
  const [currentEvidence, setCurrentEvidence] = useState<EvidenceItem>(evidence);
  const [isVerifying, setIsVerifying] = useState(false);

  const isVerified =
    currentEvidence.sha256Hash === currentEvidence.currentHash &&
    !currentEvidence.isTampered;

  const toggleTamperSimulation = () => {
    if (currentEvidence.isTampered) {
      sound.playVerify();
      setCurrentEvidence({
        ...currentEvidence,
        isTampered: false,
        currentHash: currentEvidence.sha256Hash,
      });
    } else {
      sound.playAlert();
      setCurrentEvidence({
        ...currentEvidence,
        isTampered: true,
        currentHash: "f39d89ab410b00c3b889deadbeef1234567890abcdef0123456789abcdef0123",
      });
    }
  };

  const handleReverify = () => {
    sound.playClick();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (isVerified) {
        sound.playVerify();
      } else {
        sound.playAlert();
      }
    }, 500);
  };

  const toggleEvidencePrivacy = () => {
    sound.playClick();
    setCurrentEvidence({
      ...currentEvidence,
      privacyBlurred: !currentEvidence.privacyBlurred,
    });
  };

  return (
    <Spotlight className="p-6 space-y-6">
      {/* Evidence Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-2xl border ${
              isVerified
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/15 border-rose-500/30 text-rose-400 animate-pulse"
            }`}
          >
            {isVerified ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2.5">
              Forensic Evidence Dossier: {currentEvidence.code}
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
                  isVerified
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                }`}
              >
                {isVerified ? "✓ INTEGRITY VERIFIED" : "⚠ INTEGRITY CHECK FAILED"}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Linked Incident: {currentEvidence.incidentCode} // Camera: {currentEvidence.cameraCode}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onGenerateReport(currentEvidence.id);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-500/20"
        >
          <FileText className="w-4 h-4" />
          Generate Certified Report
        </button>
      </div>

      {/* Snapshot Preview with Redaction */}
      <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-2xl flex items-center justify-center">
        <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900/80">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4" />
              [EVIDENCE SNAPSHOT FRAME #4620]
            </span>
            <span>{currentEvidence.timestamp} UTC</span>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-56 h-56 rounded-2xl border border-dashed border-cyan-500/40 flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md shadow-2xl">
              <div
                className={`w-24 h-24 rounded-full transition-all duration-300 ${
                  currentEvidence.privacyBlurred
                    ? "bg-slate-700 blur-xl scale-110"
                    : "bg-slate-700 border-2 border-cyan-400 flex items-center justify-center"
                }`}
              >
                {!currentEvidence.privacyBlurred && (
                  <span className="text-xs font-mono text-cyan-200 font-bold">
                    Person #17
                  </span>
                )}
              </div>
              <span className="mt-4 text-xs font-mono text-slate-300 font-semibold">
                {currentEvidence.privacyBlurred
                  ? "🛡️ Identity Redacted (GDPR/CJIS)"
                  : "Raw Unredacted Face"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TERMINAL: {currentEvidence.cameraCode}</span>
            <button
              onClick={toggleEvidencePrivacy}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
            >
              {currentEvidence.privacyBlurred ? (
                <EyeOff className="w-4 h-4 text-emerald-400" />
              ) : (
                <Eye className="w-4 h-4 text-cyan-400" />
              )}
              {currentEvidence.privacyBlurred ? "Redaction: Active" : "Apply Face Blur"}
            </button>
          </div>
        </div>
      </div>

      {/* SHA-256 Hash Verification & Tamper Simulation Console */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            Cryptographic Chain of Custody (SHA-256)
          </span>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReverify}
              disabled={isVerifying}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
              Re-Verify
            </button>
            <button
              onClick={toggleTamperSimulation}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                currentEvidence.isTampered
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
              }`}
            >
              {currentEvidence.isTampered ? "Restore Canonical Hash" : "Simulate Byte Tampering"}
            </button>
          </div>
        </div>

        {/* Cryptographic Hash Comparison Grid */}
        <div className="space-y-2 font-mono text-xs">
          <div>
            <span className="text-slate-400 block mb-1">
              RECORDED CANONICAL SHA-256 HASH:
            </span>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 break-all select-all font-mono">
              {currentEvidence.sha256Hash}
            </div>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">
              RUNTIME COMPUTED HASH ON DISK:
            </span>
            <div
              className={`p-2.5 rounded-xl border break-all select-all font-mono transition-colors ${
                isVerified
                  ? "bg-slate-900 border-emerald-500/50 text-emerald-400"
                  : "bg-rose-950/30 border-rose-500/50 text-rose-400 font-bold"
              }`}
            >
              {currentEvidence.currentHash}
            </div>
          </div>
        </div>

        {/* Tamper Explanation Callout */}
        {!isVerified && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Cryptographic Mismatch Detected: </span>
              The video payload hash differs from the canonical root recorded at capture. In a court of law, this item would be excluded from evidence due to chain-of-custody compromise. Click &quot;Restore Canonical Hash&quot; to restore validity.
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Certified Timestamp: {currentEvidence.verifiedAt}</span>
          <span
            className={`font-bold ${
              isVerified ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isVerified
              ? "✓ Certified Admissible (Zero Mutation)"
              : "⚠ Chain of Custody Severed"}
          </span>
        </div>
      </div>
    </Spotlight>
  );
}
