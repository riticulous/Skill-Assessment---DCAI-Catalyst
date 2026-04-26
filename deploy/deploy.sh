#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy/deploy.sh <EC2_PUBLIC_IP> <PATH_TO_PEM_KEY>
# Example: ./deploy/deploy.sh 54.123.45.67 ~/.ssh/skill-nav.pem

EC2_IP="${1:?Usage: deploy.sh <EC2_IP> <PEM_KEY>}"
PEM_KEY="${2:?Usage: deploy.sh <EC2_IP> <PEM_KEY>}"
REPO="https://github.com/riticulous/Skill-Assessment---DCAI-Catalyst.git"
APP_DIR="/home/ubuntu/app"
SSH="ssh -i $PEM_KEY -o StrictHostKeyChecking=no ubuntu@$EC2_IP"

echo "=== Deploying to $EC2_IP ==="

$SSH << 'REMOTE_SCRIPT'
set -euo pipefail
APP_DIR="/home/ubuntu/app"
REPO="https://github.com/riticulous/Skill-Assessment---DCAI-Catalyst.git"

# ── Clone or pull ─────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
    echo "[1/6] Pulling latest code..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "[1/6] Cloning repo..."
    git clone "$REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# ── Backend deps ──────────────────────────────────────────
echo "[2/6] Installing backend dependencies..."
cd "$APP_DIR/backend"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi
.venv/bin/pip install --quiet --upgrade pip
.venv/bin/pip install --quiet -r requirements.txt

# ── Frontend build ────────────────────────────────────────
echo "[3/6] Building frontend..."
cd "$APP_DIR/frontend"
npm ci --silent
npm run build

# ── Nginx config ──────────────────────────────────────────
echo "[4/6] Configuring Nginx..."
sudo cp "$APP_DIR/deploy/nginx.conf" /etc/nginx/sites-available/skill-navigator
sudo ln -sf /etc/nginx/sites-available/skill-navigator /etc/nginx/sites-enabled/skill-navigator
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# ── Systemd service ───────────────────────────────────────
echo "[5/6] Configuring backend service..."
sudo cp "$APP_DIR/deploy/skill-navigator.service" /etc/systemd/system/skill-navigator.service
sudo systemctl daemon-reload
sudo systemctl enable skill-navigator

# ── Restart backend ───────────────────────────────────────
echo "[6/6] Restarting backend..."
sudo systemctl restart skill-navigator

echo ""
echo "=== Deploy complete ==="
echo "Backend status:"
sudo systemctl status skill-navigator --no-pager -l || true
REMOTE_SCRIPT

echo ""
echo "=== Done! Site is live at http://$EC2_IP ==="
