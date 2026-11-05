#!/usr/bin/env bash
# Turnkey VPS Setup Script for Diffraction Control Plane
# Compatible with Ubuntu 22.04 / 24.04 LTS (Hetzner, DigitalOcean, Linode, AWS EC2)

set -euo pipefail

echo "=========================================================="
echo "      DIFFRACTION // TURNKEY VPS INSTALLATION             "
echo "=========================================================="

APP_DIR="/opt/diffraction"

# 1. Update system & install core packages
echo "[1/5] Installing base system dependencies..."
apt-get update
apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    zstd \
    nginx

# 2. Setup application directory
echo "[2/5] Setting up application in ${APP_DIR}..."
mkdir -p "${APP_DIR}"
cp -R . "${APP_DIR}/"
cd "${APP_DIR}"

# 3. Create Python virtual environment
echo "[3/5] Creating Python virtual environment..."
python3 -m venv venv
venv/bin/pip install --upgrade pip
venv/bin/pip install -r requirements.txt

# 4. Configure systemd service
echo "[4/5] Enabling 24/7 systemd background service..."
cp deploy/diffraction.service /etc/systemd/system/diffraction.service
systemctl daemon-reload
systemctl enable diffraction
systemctl restart diffraction

# 5. Verify service health
sleep 3
if systemctl is-active --quiet diffraction; then
    echo "=========================================================="
    echo "  [SUCCESS] Diffraction is live and running on this VPS!  "
    echo "  Web Console & API: http://$(curl -s ifconfig.me):8080   "
    echo "=========================================================="
else
    echo "[ERROR] Diffraction service failed to start. Check logs via:"
    echo "journalctl -u diffraction -f"
    exit 1
fi
