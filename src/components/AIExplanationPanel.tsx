"use client";

import React from "react";
import { Incident } from "@/types";
import { Brain, CheckCircle2, XCircle, Sparkles, Activity, ShieldAlert } from "lucide-react";
import { Spotlight } from "./ui/Spotlight";

interface AIExplanationPanelProps {
  incident: Incident;
}

export function AIExplanationPanel({ incident }: AIExplanationPanelProps) {
  const { summary, traces } = incident.explanation;

  return (
    <Spotlight className="p-6 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              Explainable AI (XAI) Causal Attribution
              <span className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                <Sparkles className="w-3 h-3" />
                Confidence: {Math.round(incident.confidence * 100)}%
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Causal justification for {incident.code} ({incident.eventType})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>YOLOv8 + Spatial Invariants</span>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-850 text-xs text-slate-300 leading-relaxed font-sans shadow-inner">
        <span className="font-bold text-cyan-400">Decision Rationale: </span>
        {summary}
      </div>

      {/* Structured Trace Rules */}
      <div className="space-y-3">
        <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Evaluated Rule Invariants & Spatial Logic
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {traces.map((trace, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-xs transition-all duration-200 ${
                trace.passed
                  ? "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {trace.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{trace.rule}</span>
                    <span className="font-mono text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {trace.metric}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
                    {trace.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Spotlight>
  );
}
