#!/usr/bin/env bash
set -euo pipefail

# Proxmox Ubuntu 22.04 desktop template (cloud-init)

TEMPLATE_ID=${TEMPLATE_ID:-9000}
TEMPLATE_NAME=${TEMPLATE_NAME:-ubuntu-22-cloud}
MEMORY_MB=${MEMORY_MB:-4096}
CORES=${CORES:-2}
BRIDGE=${BRIDGE:-vmbr0}
STORAGE=${STORAGE:-local-lvm}
IMG_PATH=/var/lib/vz/template/iso/jammy.qcow2
SNIPPETS_PATH=/var/lib/vz/snippets

echo "[+] Creating snippets directory if missing"
mkdir -p "$SNIPPETS_PATH"

if [[ ! -f $IMG_PATH ]]; then
  echo "[+] Downloading Ubuntu 22.04 cloud image"
  wget -q https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img -O "$IMG_PATH"
fi

echo "[+] Creating VM $TEMPLATE_ID ($TEMPLATE_NAME)"
qm create "$TEMPLATE_ID" --name "$TEMPLATE_NAME" --memory "$MEMORY_MB" --cores "$CORES" \
  --net0 virtio,bridge=$BRIDGE --scsihw virtio-scsi-pci

echo "[+] Importing disk to $STORAGE"
qm importdisk "$TEMPLATE_ID" "$IMG_PATH" "$STORAGE"
qm set "$TEMPLATE_ID" --scsi0 "$STORAGE:vm-$TEMPLATE_ID-disk-0" --ide2 "$STORAGE:cloudinit" \
  --boot c --bootdisk scsi0 --serial0 socket --vga serial0 --agent enabled=1

echo "[+] Writing cloud-init user-data snippet"
cat >"$SNIPPETS_PATH/ci-ubuntu-desktop.yml" <<'YAML'
#cloud-config
users:
  - name: student
    lock_passwd: false
    # Generate your own hash: mkpasswd -m sha-512
    passwd: $6$rounds=4096$qwerty$JmV6k8grvZ0K0..replace.me..
    groups: sudo
    shell: /bin/bash
package_update: true
packages:
  - xfce4
  - xrdp
  - firefox
  - build-essential
  - python3-pip
  - git
  - net-tools
  - wireshark
  - iperf3
runcmd:
  - systemctl enable --now xrdp
  - usermod -a -G wireshark student
  - apt-get clean
YAML

qm set "$TEMPLATE_ID" --ipconfig0 ip=dhcp --sshkeys /root/.ssh/authorized_keys \
  --cicustom "user=local:snippets/ci-ubuntu-desktop.yml"

echo "[+] Converting to template"
qm template "$TEMPLATE_ID"

echo "[✓] Template ready: $TEMPLATE_ID ($TEMPLATE_NAME)"


