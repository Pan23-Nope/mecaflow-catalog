#!/bin/bash

# Default message with timestamp
MESSAGE=${1:-"Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"}

echo "🚀 Starting deployment..."

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to deploy."
    exit 0
fi

echo "📦 Staging changes..."
git add .

echo "💾 Committing changes with message: '$MESSAGE'..."
git commit -m "$MESSAGE"

echo "📤 Pushing to GitHub..."
git push origin main

echo "✨ Deployment complete! GitHub Pages will update shortly."
