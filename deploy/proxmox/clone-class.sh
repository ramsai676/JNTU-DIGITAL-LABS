#!/usr/bin/env bash
set -euo pipefail

# Clone a set of student VMs from the template

TEMPLATE_ID=${TEMPLATE_ID:-9000}
COUNT=${COUNT:-20}
START_ID=${START_ID:-101}
NAME_PREFIX=${NAME_PREFIX:-ubuntu-lab}
BRIDGE0=${BRIDGE0:-vmbr0}
BRIDGE1=${BRIDGE1:-vmbr1}

echo "[+] Cloning $COUNT VMs from template $TEMPLATE_ID"
for n in $(seq 0 $((COUNT-1))); do
  ID=$((START_ID + n))
  NAME="$NAME_PREFIX-$(printf '%02d' $((n+1)))"
  echo "  -> VM $ID ($NAME)"
  qm clone "$TEMPLATE_ID" "$ID" --name "$NAME" --full 1
  qm set "$ID" --ipconfig0 ip=dhcp --net1 virtio,bridge=$BRIDGE1
  qm set "$ID" --net0 virtio,bridge=$BRIDGE0
  qm start "$ID"
done

echo "[✓] Cloning complete"


