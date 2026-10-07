from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import shutil
from .database import get_connection, init_db
from .integrity import generate_evidence_hash

app = FastAPI(title="SentinelX AI Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {"status": "ONLINE", "system": "SentinelX AI Vision Engine", "version": "2.0.0"}

@app.get("/api/cameras")
def list_cameras():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM cameras").fetchall()
    cameras = []
    for r in rows:
        cam = dict(r)
        cam["zones"] = json.loads(cam["zones_json"])
        del cam["zones_json"]
        cameras.append(cam)
    conn.close()
    return cameras

@app.get("/api/incidents")
def list_incidents(severity: Optional[str] = None, camera: Optional[str] = None):
    conn = get_connection()
    query = "SELECT * FROM incidents WHERE 1=1"
    params = []
    if severity:
        query += " AND severity = ?"
        params.append(severity.upper())
    if camera:
        query += " AND (camera_code = ? OR camera_id = ?)"
        params.extend([camera.upper(), camera.lower()])
    
    query += " ORDER BY timestamp_seconds DESC"
    rows = conn.execute(query, params).fetchall()
    incidents = []
    for r in rows:
        inc = dict(r)
        inc["explanation"] = json.loads(inc["explanation_json"])
        del inc["explanation_json"]
        incidents.append(inc)
    conn.close()
    return incidents

@app.get("/api/evidence")
def list_evidence():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM evidence ORDER BY timestamp_seconds DESC").fetchall()
    evidence = [dict(r) for r in rows]
    conn.close()
    return evidence

@app.post("/api/evidence/{evidence_id}/verify")
def verify_evidence(evidence_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM evidence WHERE id = ?", (evidence_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Evidence item not found")
    
    item = dict(row)
    is_valid = (item["sha256_hash"] == item["current_hash"]) and (not item["is_tampered"])
    conn.close()
    return {
        "evidence_id": evidence_id,
        "verified": is_valid,
        "expected_hash": item["sha256_hash"],
        "actual_hash": item["current_hash"],
        "tampered": bool(item["is_tampered"])
    }

@app.post("/api/evidence/{evidence_id}/tamper-test")
def tamper_test_evidence(evidence_id: str):
    conn = get_connection()
    row = conn.execute("SELECT * FROM evidence WHERE id = ?", (evidence_id,)).fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Evidence item not found")
    
    item = dict(row)
    # Flip tamper state
    new_tampered = 0 if item["is_tampered"] else 1
    new_hash = item["sha256_hash"] if not new_tampered else "f39d89ab410b00c3b889deadbeef1234567890abcdef0123456789abcdef0123"
    
    conn.execute(
        "UPDATE evidence SET is_tampered = ?, current_hash = ? WHERE id = ?",
        (new_tampered, new_hash, evidence_id)
    )
    conn.commit()
    conn.close()
    return {"evidence_id": evidence_id, "is_tampered": bool(new_tampered), "current_hash": new_hash}

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    dest_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(dest_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    file_size_mb = os.path.getsize(dest_path) / (1024 * 1024)
    return {
        "status": "UPLOAD_SUCCESS",
        "filename": file.filename,
        "size_mb": round(file_size_mb, 2),
        "path": dest_path,
        "message": "Video queued for AI object detection and smart zone analysis."
    }
