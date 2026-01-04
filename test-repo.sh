#!/bin/bash

# Test script to verify repository URL
echo "Testing repository URL..."

# Set the same variable as in main script
PANEL_REPO="https://github.com/pterodactyl/panel.git"

echo "PANEL_REPO = '$PANEL_REPO'"
echo "Length of PANEL_REPO: ${#PANEL_REPO}"

if [ -z "$PANEL_REPO" ]; then
    echo "ERROR: PANEL_REPO is empty"
    exit 1
else
    echo "SUCCESS: PANEL_REPO is set correctly"
fi

# Test git ls-remote to verify repository exists
echo "Testing repository access..."
git ls-remote "$PANEL_REPO" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "SUCCESS: Repository is accessible"
else
    echo "ERROR: Repository is not accessible"
    exit 1
fi

echo "All tests passed!"
