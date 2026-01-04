#!/bin/bash

# Pterodactyl Panel Installer - Quick Install Script
# This script downloads and executes the main installer

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Installer URL
INSTALLER_URL="https://raw.githubusercontent.com/pterodactyl-installer/pterodactyl-installer/main/pterodactyl-installer.sh"
INSTALLER_FILE="/tmp/pterodactyl-installer.sh"

# Print header
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Pterodactyl Panel Installer${NC}"
    echo -e "${BLUE}  Quick Install Script${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        echo -e "${RED}[ERROR]${NC} This script must be run as root"
        echo "Please run: sudo $0"
        exit 1
    fi
}

# Download installer
download_installer() {
    echo -e "${GREEN}[INFO]${NC} Downloading Pterodactyl installer..."
    
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$INSTALLER_URL" -o "$INSTALLER_FILE"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$INSTALLER_URL" -O "$INSTALLER_FILE"
    else
        echo -e "${RED}[ERROR]${NC} Neither curl nor wget is available"
        echo "Please install curl or wget and try again"
        exit 1
    fi
    
    chmod +x "$INSTALLER_FILE"
}

# Execute installer
execute_installer() {
    echo -e "${GREEN}[INFO]${NC} Starting Pterodactyl installer..."
    echo ""
    
    # Execute the main installer
    bash "$INSTALLER_FILE"
    
    # Cleanup
    rm -f "$INSTALLER_FILE"
}

# Main function
main() {
    print_header
    check_root
    download_installer
    execute_installer
}

# Run main function
main "$@"
