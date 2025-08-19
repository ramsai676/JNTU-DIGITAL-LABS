#!/usr/bin/env bash
set -euo pipefail

CRON_FILE=/etc/cron.d/jntu-lab-reset

cat >"$CRON_FILE" <<'CRON'
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# Nightly at 03:00
0 3 * * * root /usr/local/bin/lab-reset.sh >> /var/log/lab-reset.log 2>&1
CRON

chmod 644 "$CRON_FILE"
systemctl restart cron || systemctl restart crond || true
echo "[✓] Cron installed: $CRON_FILE"


