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

# Installer URL - Multiple options available
# Option 1: Use local file (recommended for testing)
INSTALLER_FILE="./pterodactyl-installer.sh"

# Option 2: Use a working repository URL (uncomment to use)
# INSTALLER_URL="https://raw.githubusercontent.com/vilhelmprytz/pterodactyl-installer/main/pterodactyl-installer.sh"
# INSTALLER_FILE="/tmp/pterodactyl-installer.sh"

# Option 3: Use your own repository (replace YOUR_USERNAME)
# INSTALLER_URL="https://raw.githubusercontent.com/YOUR_USERNAME/pterodactyl-installer/main/pterodactyl-installer.sh"
# INSTALLER_FILE="/tmp/pterodactyl-installer.sh"

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
    # Check if using local file
    if [ -f "$INSTALLER_FILE" ] && [ "$INSTALLER_FILE" = "./pterodactyl-installer.sh" ]; then
        echo -e "${GREEN}[INFO]${NC} Using local installer file: $INSTALLER_FILE"
        return 0
    fi
    
    # Check if INSTALLER_URL is set
    if [ -z "$INSTALLER_URL" ]; then
        echo -e "${RED}[ERROR]${NC} INSTALLER_URL is not set"
        echo -e "${YELLOW}[HELP]${NC} Please edit install.sh and set INSTALLER_URL"
        echo "Example: INSTALLER_URL=\"https://raw.githubusercontent.com/YOUR_USERNAME/pterodactyl-installer/main/pterodactyl-installer.sh\""
        exit 1
    fi
    
    echo -e "${GREEN}[INFO]${NC} Downloading Pterodactyl installer from: $INSTALLER_URL"
    
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$INSTALLER_URL" -o "$INSTALLER_FILE"
    elif command -v wget >/dev/null 2>&1; then
        wget -q "$INSTALLER_URL" -O "$INSTALLER_FILE"
    else
        echo -e "${RED}[ERROR]${NC} Neither curl nor wget is available"
        echo "Please install curl or wget and try again"
        exit 1
    fi
    
    # Verify download was successful
    if [ ! -f "$INSTALLER_FILE" ]; then
        echo -e "${RED}[ERROR]${NC} Failed to download installer"
        echo "Please check the URL and your internet connection"
        exit 1
    fi
    
    chmod +x "$INSTALLER_FILE"
    echo -e "${GREEN}[INFO]${NC} Installer downloaded successfully"
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
