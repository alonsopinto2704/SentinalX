import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sentinelx.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cameras (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT NOT NULL,
        resolution TEXT NOT NULL,
        fps INTEGER NOT NULL,
        sample_video_type TEXT NOT NULL,
        zones_json TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        event_type TEXT NOT NULL,
        camera_id TEXT NOT NULL,
        camera_code TEXT NOT NULL,
        camera_location TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        timestamp_seconds REAL NOT NULL,
        duration_seconds REAL NOT NULL,
        severity TEXT NOT NULL,
        confidence REAL NOT NULL,
        track_id TEXT NOT NULL,
        zone_name TEXT NOT NULL,
        evidence_id TEXT NOT NULL,
        status TEXT NOT NULL,
        explanation_json TEXT NOT NULL,
        FOREIGN KEY (camera_id) REFERENCES cameras (id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        incident_id TEXT NOT NULL,
        incident_code TEXT NOT NULL,
        camera_id TEXT NOT NULL,
        camera_code TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        timestamp_seconds REAL NOT NULL,
        duration_seconds REAL NOT NULL,
        sha256_hash TEXT NOT NULL,
        current_hash TEXT NOT NULL,
        is_tampered INTEGER NOT NULL DEFAULT 0,
        privacy_blurred INTEGER NOT NULL DEFAULT 0,
        keyframe_description TEXT NOT NULL,
        event_summary TEXT NOT NULL,
        verified_at TEXT NOT NULL,
        FOREIGN KEY (incident_id) REFERENCES incidents (id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        target_id TEXT,
        details TEXT
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("SentinelX Database schema initialized at", DB_PATH)
