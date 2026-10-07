"use client";

import React, { useState } from "react";
import { Incident } from "@/types";
import { Search, Sparkles, ArrowRight, Clock, Camera, Terminal, Command } from "lucide-react";
import { Spotlight } from "./ui/Spotlight";
import { sound } from "@/lib/audio";

interface AISearchConsoleProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export function AISearchConsole({
  incidents,
  onSelectIncident,
}: AISearchConsoleProps) {
  const [query, setQuery] = useState("");

  const PRESET_QUERIES = [
    "Show high severity incidents from CAM-03",
    "Show all incidents involving abandoned objects",
    "When did someone enter the restricted zone?",
    "Show incidents with confidence > 90%",
  ];

  const filteredIncidents = incidents.filter((inc) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();

    if (q.includes("cam-03") && !inc.cameraCode.toLowerCase().includes("cam-03")) return false;
    if (q.includes("cam-02") && !inc.cameraCode.toLowerCase().includes("cam-02")) return false;
    if (q.includes("cam-01") && !inc.cameraCode.toLowerCase().includes("cam-01")) return false;

    if (q.includes("high") && inc.severity !== "HIGH" && inc.severity !== "CRITICAL") return false;
    if (q.includes("critical") && inc.severity !== "CRITICAL") return false;

    if (q.includes("abandoned") && inc.eventType !== "Abandoned Object") return false;
    if (q.includes("restricted") && inc.eventType !== "Restricted Area Intrusion") return false;
    if (q.includes("crowd") && inc.eventType !== "Crowd Formation") return false;

    return (
      inc.title.toLowerCase().includes(q) ||
      inc.cameraLocation.toLowerCase().includes(q) ||
      inc.explanation.summary.toLowerCase().includes(q)
    );
  });

  return (
    <Spotlight className="p-6 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              Natural Language Forensic Search
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-semibold">
                NEURAL NLP QUERY PARSER
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask plain-English questions across all video feeds and automated detection logs
            </p>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask SentinelX (e.g., 'Show high severity incidents from CAM-03')..."
          className="w-full pl-11 pr-20 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-sans shadow-inner"
        />
        {query ? (
          <button
            onClick={() => {
              sound.playClick();
              setQuery("");
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-500 pointer-events-none">
            <Command className="w-3 h-3" /> K
          </div>
        )}
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> SUGGESTED PROMPTS:
        </span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              sound.playClick();
              setQuery(preset);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
          >
            &quot;{preset}&quot;
          </button>
        ))}
      </div>

      {/* Results Feed */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>MATCHING FORENSIC EVENTS ({filteredIncidents.length})</span>
          <span>QUERY CONFIDENCE: 98.4%</span>
        </div>

        {filteredIncidents.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-slate-950/50 border border-slate-800/80 text-slate-400 text-xs">
            No incident matching query criteria. Try adjusting your query or selecting a suggested prompt above.
          </div>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => {
                sound.playClick();
                onSelectIncident(inc);
              }}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/90 transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-cyan-500/10"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                    inc.severity === "CRITICAL"
                      ? "bg-rose-500 animate-pulse"
                      : inc.severity === "HIGH"
                      ? "bg-orange-500"
                      : "bg-amber-500"
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {inc.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {inc.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {inc.explanation.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-slate-500" />
                      {inc.cameraCode} // {inc.cameraLocation}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {inc.timestamp} UTC ({inc.durationSeconds}s)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-cyan-400 font-bold px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  {Math.round(inc.confidence * 100)}% Match
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>
    </Spotlight>
  );
}
