import sqlite3
import json
import os
from .database import get_connection, init_db

CAMERAS_SEED = [
    {
        "id": "cam-01",
        "code": "CAM-01",
        "name": "Perimeter Gate North",
        "location": "North Boundary Fence & Vehicle Gate",
        "status": "RECORDING",
        "resolution": "1920x1080 @ 30fps",
        "fps": 30,
        "sample_video_type": "crowd",
        "zones": [
            {
                "id": "z-cam01-1",
                "name": "Security Perimeter North",
                "type": "RESTRICTED",
                "color": "#EF4444",
                "dwellThresholdSeconds": 3.0,
                "points": [{"x": 0.1, "y": 0.2}, {"x": 0.45, "y": 0.2}, {"x": 0.45, "y": 0.8}, {"x": 0.1, "y": 0.8}]
            }
        ]
    },
    {
        "id": "cam-02",
        "code": "CAM-02",
        "name": "Lobby & Main Reception",
        "location": "Central Building Ground Floor",
        "status": "RECORDING",
        "resolution": "1920x1080 @ 30fps",
        "fps": 30,
        "sample_video_type": "abandoned",
        "zones": [
            {
                "id": "z-cam02-1",
                "name": "Restricted Server Corridor",
                "type": "RESTRICTED",
                "color": "#F97316",
                "dwellThresholdSeconds": 5.0,
                "points": [{"x": 0.65, "y": 0.15}, {"x": 0.95, "y": 0.15}, {"x": 0.95, "y": 0.75}, {"x": 0.65, "y": 0.75}]
            }
        ]
    },
    {
        "id": "cam-03",
        "code": "CAM-03",
        "name": "Central Building — Entrance",
        "location": "South Entrance Vestibule & Turnstiles",
        "status": "ALERT",
        "resolution": "3840x2160 @ 60fps",
        "fps": 60,
        "sample_video_type": "intrusion",
        "zones": [
            {
                "id": "z-cam03-1",
                "name": "High Security Access Zone",
                "type": "RESTRICTED",
                "color": "#EF4444",
                "dwellThresholdSeconds": 5.0,
                "points": [{"x": 0.48, "y": 0.25}, {"x": 0.85, "y": 0.25}, {"x": 0.85, "y": 0.88}, {"x": 0.48, "y": 0.88}]
            },
            {
                "id": "z-cam03-2",
                "name": "Authorized Passage Zone",
                "type": "MONITORED",
                "color": "#3B82F6",
                "dwellThresholdSeconds": 15.0,
                "points": [{"x": 0.08, "y": 0.25}, {"x": 0.42, "y": 0.25}, {"x": 0.42, "y": 0.88}, {"x": 0.08, "y": 0.88}]
            }
        ]
    },
    {
        "id": "cam-04",
        "code": "CAM-04",
        "name": "Secure Loading Dock",
        "location": "Underground Logistics Facility Bay 3",
        "status": "RECORDING",
        "resolution": "1920x1080 @ 30fps",
        "fps": 30,
        "sample_video_type": "rapid",
        "zones": [
            {
                "id": "z-cam04-1",
                "name": "Hazard & Heavy Equipment Bay",
                "type": "RESTRICTED",
                "color": "#EF4444",
                "dwellThresholdSeconds": 4.0,
                "points": [{"x": 0.2, "y": 0.3}, {"x": 0.75, "y": 0.3}, {"x": 0.75, "y": 0.9}, {"x": 0.2, "y": 0.9}]
            }
        ]
    }
]

INCIDENTS_SEED = [
    {
        "id": "inc-00042",
        "code": "INC-00042",
        "title": "Restricted Area Intrusion",
        "event_type": "Restricted Area Intrusion",
        "camera_id": "cam-03",
        "camera_code": "CAM-03",
        "camera_location": "Central Building — Entrance",
        "timestamp": "14:32:18",
        "timestamp_seconds": 154,
        "duration_seconds": 18.4,
        "severity": "HIGH",
        "confidence": 0.94,
        "track_id": "Person #17",
        "zone_name": "High Security Access Zone",
        "evidence_id": "evd-00042",
        "status": "INVESTIGATING",
        "explanation": {
            "summary": "Person #17 breached High Security Access Zone boundary and lingered for 18.4 seconds without valid badge transponder signal.",
            "traces": [
                {"rule": "Object Classification", "passed": True, "metric": "Confidence 94.2%", "detail": "YOLO detection model confirmed category: Person"},
                {"rule": "Boundary Traversal", "passed": True, "metric": "Crossing Point (0.52, 0.48)", "detail": "Trajectory vector crossed polygon edge at frame #4620"},
                {"rule": "Zone Residence Threshold", "passed": True, "metric": "18.4s elapsed (Threshold: 5.0s)", "detail": "Subject remained actively inside restricted perimeter for 18.4 seconds"},
                {"rule": "Credential Authorization", "passed": False, "metric": "No RFID/Beacon matched", "detail": "Access control audit log indicates no authorized badge scan event"}
            ]
        }
    },
    {
        "id": "inc-00041",
        "code": "INC-00041",
        "title": "Unattended / Abandoned Backpack",
        "event_type": "Abandoned Object",
        "camera_id": "cam-02",
        "camera_code": "CAM-02",
        "camera_location": "Lobby & Main Reception",
        "timestamp": "13:58:04",
        "timestamp_seconds": 98,
        "duration_seconds": 124.0,
        "severity": "CRITICAL",
        "confidence": 0.96,
        "track_id": "Bag #09",
        "zone_name": "Restricted Server Corridor",
        "evidence_id": "evd-00041",
        "status": "NEW",
        "explanation": {
            "summary": "Stationary baggage detected with carrier (Person #24) departing scene beyond 15-meter proximity threshold.",
            "traces": [
                {"rule": "Object Detection", "passed": True, "metric": "Confidence 96.1%", "detail": "High-confidence detection of luggage/backpack item"},
                {"rule": "Carrier Separation", "passed": True, "metric": "Separation > 15m", "detail": "Carrier Person #24 walked away leaving item unattended"},
                {"rule": "Stationary Dwell", "passed": True, "metric": "124 seconds stationary", "detail": "Zero movement detected for > 60 seconds trigger threshold"}
            ]
        }
    }
]

EVIDENCE_SEED = [
    {
        "id": "evd-00042",
        "code": "EVD-2026-00042",
        "incident_id": "inc-00042",
        "incident_code": "INC-00042",
        "camera_id": "cam-03",
        "camera_code": "CAM-03",
        "timestamp": "14:32:18",
        "timestamp_seconds": 154,
        "duration_seconds": 18.4,
        "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "current_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "is_tampered": 0,
        "privacy_blurred": 0,
        "keyframe_description": "Frame #4620: Person #17 entering High Security Access Zone",
        "event_summary": "Restricted Area Intrusion — Central Building Entrance",
        "verified_at": "2026-10-07 14:35:02 UTC"
    },
    {
        "id": "evd-00041",
        "code": "EVD-2026-00041",
        "incident_id": "inc-00041",
        "incident_code": "INC-00041",
        "camera_id": "cam-02",
        "camera_code": "CAM-02",
        "timestamp": "13:58:04",
        "timestamp_seconds": 98,
        "duration_seconds": 124.0,
        "sha256_hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
        "current_hash": "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
        "is_tampered": 0,
        "privacy_blurred": 0,
        "keyframe_description": "Frame #2940: Unattended Black Backpack left near Reception column",
        "event_summary": "Abandoned Object — Main Lobby",
        "verified_at": "2026-10-07 14:01:15 UTC"
    }
]

def seed_database():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    for cam in CAMERAS_SEED:
        cursor.execute("""
        INSERT OR REPLACE INTO cameras (id, code, name, location, status, resolution, fps, sample_video_type, zones_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (cam["id"], cam["code"], cam["name"], cam["location"], cam["status"], cam["resolution"], cam["fps"], cam["sample_video_type"], json.dumps(cam["zones"])))

    for inc in INCIDENTS_SEED:
        cursor.execute("""
        INSERT OR REPLACE INTO incidents (id, code, title, event_type, camera_id, camera_code, camera_location, timestamp, timestamp_seconds, duration_seconds, severity, confidence, track_id, zone_name, evidence_id, status, explanation_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (inc["id"], inc["code"], inc["title"], inc["event_type"], inc["camera_id"], inc["camera_code"], inc["camera_location"], inc["timestamp"], inc["timestamp_seconds"], inc["duration_seconds"], inc["severity"], inc["confidence"], inc["track_id"], inc["zone_name"], inc["evidence_id"], inc["status"], json.dumps(inc["explanation"])))

    for evd in EVIDENCE_SEED:
        cursor.execute("""
        INSERT OR REPLACE INTO evidence (id, code, incident_id, incident_code, camera_id, camera_code, timestamp, timestamp_seconds, duration_seconds, sha256_hash, current_hash, is_tampered, privacy_blurred, keyframe_description, event_summary, verified_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (evd["id"], evd["code"], evd["incident_id"], evd["incident_code"], evd["camera_id"], evd["camera_code"], evd["timestamp"], evd["timestamp_seconds"], evd["duration_seconds"], evd["sha256_hash"], evd["current_hash"], evd["is_tampered"], evd["privacy_blurred"], evd["keyframe_description"], evd["event_summary"], evd["verified_at"]))

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic forensic records.")

if __name__ == "__main__":
    seed_database()
