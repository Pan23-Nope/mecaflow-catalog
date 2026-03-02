#!/bin/bash

# Default message with timestamp
MESSAGE=${1:-"Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "[*] Starting deployment..."

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo "[OK] No changes to deploy."
    exit 0
fi

echo "[BOX] Staging changes..."
git add .

echo "[DISK] Committing changes with message: '$MESSAGE'..."
git commit -m "$MESSAGE"

echo "[UP] Pushing to GitHub..."
git push origin main

echo "[DONE] Deployment complete! GitHub Pages will update shortly."
