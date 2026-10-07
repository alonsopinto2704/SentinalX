import hashlib
import json

def generate_evidence_hash(evidence_data: dict) -> str:
    """Computes deterministic SHA-256 hash over canonical evidence dictionary."""
    canonical_bytes = json.dumps(evidence_data, sort_keys=True).encode("utf-8")
    return hashlib.sha256(canonical_bytes).hexdigest()

def verify_evidence_integrity(original_hash: str, current_data: dict) -> bool:
    """Verifies whether the current data matches the original recorded SHA-256 hash."""
    current_hash = generate_evidence_hash(current_data)
    return current_hash == original_hash
