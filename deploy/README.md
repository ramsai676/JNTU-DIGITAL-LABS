JNTU Digital Labs – Multi‑User Browser Lab Deployment
=====================================================

This folder contains production‑ready scripts and configs to deploy a multi‑user, browser‑based Ubuntu lab with Proxmox VE, Apache Guacamole, and an HTTPS reverse proxy.

Overview
--------
- Proxmox VE host runs Ubuntu VM template and student VMs
- Guacamole (Docker) provides HTML5 RDP/SSH access
- Nginx + Let’s Encrypt terminates TLS
- Nightly snapshot rollback for clean state; optional persistence

Prerequisites
-------------
- Proxmox VE 8.x installed on a server (≥8 cores, 64 GB RAM recommended)
- A DNS record pointing to your Guacamole VM (e.g. labs.your-domain.com)
- Linux admin access to the Proxmox host and the Guacamole VM

1) Create Ubuntu Template on Proxmox
------------------------------------
On the Proxmox host, edit variables inside `proxmox/create-template.sh` if needed, then run:

```bash
bash deploy/proxmox/create-template.sh
```

What it does:
- Downloads Ubuntu 22.04 cloud image
- Creates VM 9000 as a cloud‑init desktop template (XFCE + xrdp + tools)
- Adds a cloud‑init snippet `ci-ubuntu-desktop.yml`

Important: Update the hashed password in `proxmox/ci-ubuntu-desktop.yml` (line with `passwd:`) using:

```bash
mkpasswd -m sha-512
```

2) Clone Student VMs
--------------------
Adjust counts and IDs in `proxmox/clone-class.sh`, then run:

```bash
bash deploy/proxmox/clone-class.sh
```

What it does:
- Clones VMs from template 9000
- Adds second NIC on `vmbr1` for networking labs
- Starts the VMs

3) Set Up Guacamole (on a small Ubuntu VM)
-----------------------------------------
SSH into the Guacamole VM and run:

```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
cd /opt && sudo mkdir -p guacamole && cd guacamole
sudo cp -r /path/to/repo/deploy/guacamole/* .
sudo docker compose up -d
```

Login at `http://<guac-vm-ip>:8080/guacamole/` with `guacadmin/guacadmin` (change immediately). Create RDP connections pointing to VM IPs and assign them to user groups.

4) HTTPS with Nginx + Let’s Encrypt
-----------------------------------
On the Guacamole VM:

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
sudo cp /path/to/repo/deploy/nginx/labs.conf /etc/nginx/sites-available/
sudo sed -i 's/labs.example.com/labs.your-domain.com/g' /etc/nginx/sites-available/labs.conf
sudo ln -sf /etc/nginx/sites-available/labs.conf /etc/nginx/sites-enabled/labs.conf
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d labs.your-domain.com --redirect --agree-tos -m you@your-domain.com --non-interactive
```

5) Nightly Reset
----------------
Copy and edit `cron/lab-reset.sh` VM ID list, then install the cron job:

```bash
sudo cp deploy/cron/lab-reset.sh /usr/local/bin/lab-reset.sh
sudo chmod +x /usr/local/bin/lab-reset.sh
sudo cp deploy/cron/install-cron.sh /usr/local/bin/install-lab-cron.sh
sudo bash /usr/local/bin/install-lab-cron.sh
```

6) GPU/USB (Optional)
----------------------
- Enable IOMMU on Proxmox for GPU passthrough, then add GPU to selected VMs
- Use USB/IP for device redirection to VMs when accessing via browser

Link From Website
-----------------
Add a button in your site pointing to `https://labs.your-domain.com/`.

Security Notes
--------------
- Change all default passwords
- Restrict Guacamole exposure (firewall, allowlist, SSO if available)
- Keep Proxmox and containers updated


