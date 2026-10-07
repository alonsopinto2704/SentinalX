export interface SmartZone {
  id: string;
  name: string;
  type: "RESTRICTED" | "MONITORED" | "NORMAL";
  color: string;
  points: { x: number; y: number }[]; // Normalized 0..1 coordinates
  dwellThresholdSeconds: number;
}

export interface Camera {
  id: string;
  code: string;
  name: string;
  location: string;
  status: "ONLINE" | "RECORDING" | "ALERT" | "OFFLINE";
  resolution: string;
  fps: number;
  zones: SmartZone[];
  sampleVideoType: "intrusion" | "abandoned" | "crowd" | "rapid";
}

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "NORMAL";
export type EventType =
  | "Restricted Area Intrusion"
  | "Abandoned Object"
  | "Crowd Formation"
  | "Rapid Movement";

export interface DetectionBox {
  id: string;
  trackId: string;
  label: string;
  confidence: number;
  x: number; // Normalized 0..1
  y: number;
  width: number;
  height: number;
  timestamp: number;
}

export interface XAIExplanationTrace {
  rule: string;
  passed: boolean;
  metric: string;
  detail: string;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  eventType: EventType;
  cameraId: string;
  cameraCode: string;
  cameraLocation: string;
  timestamp: string;
  timestampSeconds: number;
  durationSeconds: number;
  severity: Severity;
  confidence: number;
  trackId: string;
  zoneName: string;
  explanation: {
    summary: string;
    traces: XAIExplanationTrace[];
  };
  evidenceId: string;
  status: "NEW" | "INVESTIGATING" | "VERIFIED" | "RESOLVED";
}

export interface EvidenceItem {
  id: string;
  code: string;
  incidentId: string;
  incidentCode: string;
  cameraId: string;
  cameraCode: string;
  timestamp: string;
  timestampSeconds: number;
  durationSeconds: number;
  sha256Hash: string;
  currentHash: string;
  isTampered: boolean;
  privacyBlurred: boolean;
  keyframeDescription: string;
  eventSummary: string;
  verifiedAt: string;
}
