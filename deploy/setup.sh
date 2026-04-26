#!/usr/bin/env bash
set -euo pipefail

echo "=== Skill Navigator — EC2 First-Time Setup ==="

sudo apt-get update -y
sudo apt-get upgrade -y

# Python 3.11+
sudo apt-get install -y python3 python3-pip python3-venv

# Node.js 20 LTS via NodeSource
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Nginx
sudo apt-get install -y nginx

# Git
sudo apt-get install -y git

# Create app directory
mkdir -p /home/ubuntu/app

echo ""
echo "=== Setup complete ==="
echo "Node: $(node --version)"
echo "npm:  $(npm --version)"
echo "Python: $(python3 --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo ""
echo "Next: run deploy.sh from your local machine."
