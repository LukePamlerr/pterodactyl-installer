#!/bin/bash

# Debug script to identify repository issues
echo "=== Pterodactyl Installer Debug ==="
echo ""

# Check if git is installed
if ! command -v git >/dev/null 2>&1; then
    echo "❌ ERROR: git is not installed"
    exit 1
else
    echo "✅ git is installed: $(git --version)"
fi

# Check internet connectivity
echo "🔍 Checking internet connectivity..."
if ping -c 1 github.com >/dev/null 2>&1; then
    echo "✅ GitHub is reachable"
else
    echo "❌ ERROR: GitHub is not reachable"
    exit 1
fi

# Test repository access
echo "🔍 Testing repository access..."
REPO_URL="https://github.com/pterodactyl/panel.git"

if git ls-remote "$REPO_URL" >/dev/null 2>&1; then
    echo "✅ Repository is accessible: $REPO_URL"
else
    echo "❌ ERROR: Repository is not accessible: $REPO_URL"
    echo "   This could be due to:"
    echo "   - No internet connection"
    echo "   - Firewall blocking git"
    echo "   - DNS issues"
    exit 1
fi

# Test cloning to temp directory
echo "🔍 Testing git clone..."
TEMP_DIR="/tmp/pterodactyl-test-$$"
mkdir -p "$TEMP_DIR"

if git clone "$REPO_URL" "$TEMP_DIR" >/dev/null 2>&1; then
    echo "✅ Git clone successful"
    
    # Check if required files exist
    if [ -f "$TEMP_DIR/composer.json" ] && [ -f "$TEMP_DIR/.env.example" ]; then
        echo "✅ Required files are present"
    else
        echo "❌ ERROR: Required files are missing"
        ls -la "$TEMP_DIR"
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
else
    echo "❌ ERROR: Git clone failed"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo ""
echo "🎉 All tests passed! The installer should work correctly."
echo ""
echo "If you're still getting 'repository does not exist' errors,"
echo "please run the installer with this command:"
echo ""
echo "sudo bash -x ./pterodactyl-installer.sh install-panel"
echo ""
echo "This will show detailed execution information."
