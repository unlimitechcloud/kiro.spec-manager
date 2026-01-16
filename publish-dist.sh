#!/bin/bash

# Script to publish dist/ to a separate branch for distribution

set -e

echo "Building power..."
npm run build

echo "Creating dist branch..."
git checkout -b dist-branch 2>/dev/null || git checkout dist-branch

# Remove all files except dist/
echo "Cleaning branch..."
git rm -rf . 2>/dev/null || true

# Copy dist contents to root
echo "Copying dist files to root..."
cp -r dist/* .

# Remove dist directory itself
rm -rf dist

# Add all files
git add .

# Commit
echo "Committing..."
git commit -m "Update distribution files" || echo "No changes to commit"

echo ""
echo "✅ Distribution branch ready!"
echo ""
echo "To publish to GitHub:"
echo "  git push origin dist-branch -f"
echo ""
echo "To return to main branch:"
echo "  git checkout main"
