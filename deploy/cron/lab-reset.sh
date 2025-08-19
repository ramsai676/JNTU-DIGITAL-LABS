#!/usr/bin/env bash
set -euo pipefail

# Nightly reset: rollback VMs to snapshot "clean" and start them
# Edit VM_IDS to include all lab VMs; exclude persistent seats

VM_IDS=(101 102 103 104 105 106 107 108 109 110)
SNAPSHOT="clean"

for id in "${VM_IDS[@]}"; do
  echo "[reset] VM $id"
  qm stop "$id" || true
  qm rollback "$id" "$SNAPSHOT"
  qm start "$id"
done

echo "[✓] Reset complete"


