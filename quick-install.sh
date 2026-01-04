#!/bin/bash

# Pterodactyl Panel & Wings Quick Installer
# Self-contained installation script

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_INSTALLER="$SCRIPT_DIR/pterodactyl-installer.sh"

# Print header
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Pterodactyl Panel & Wings Installer${NC}"
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

# Check if main installer exists
check_installer() {
    if [ ! -f "$MAIN_INSTALLER" ]; then
        echo -e "${RED}[ERROR]${NC} Main installer not found: $MAIN_INSTALLER"
        echo "Please ensure pterodactyl-installer.sh is in the same directory"
        exit 1
    fi
    
    echo -e "${GREEN}[INFO]${NC} Found main installer: $MAIN_INSTALLER"
    chmod +x "$MAIN_INSTALLER"
}

# Install dependencies
install_deps() {
    echo -e "${GREEN}[INFO]${NC} Installing required dependencies..."
    
    if command -v apt >/dev/null 2>&1; then
        apt update
        apt install -y curl wget git unzip
    elif command -v pacman >/dev/null 2>&1; then
        pacman -S --noconfirm curl wget git unzip
    else
        echo -e "${YELLOW}[WARNING]${NC} Please ensure curl, wget, git, and unzip are installed"
    fi
}

# Execute main installer
execute_installer() {
    echo -e "${GREEN}[INFO]${NC} Starting Pterodactyl installer..."
    echo ""
    
    # Execute main installer
    bash "$MAIN_INSTALLER"
}

# Main function
main() {
    print_header
    check_root
    check_installer
    install_deps
    execute_installer
}

# Run main function
main "$@"
