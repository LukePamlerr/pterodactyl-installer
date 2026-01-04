#!/bin/bash

# Pterodactyl Panel & Wings Installer Script
# Supports: Ubuntu 20.04, 22.04, 24.04 / Debian 10+ / Arch Linux
# Auto-updates from official repository

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Global variables
SCRIPT_VERSION="1.0.0"
INSTALL_DIR="/var/www/pterodactyl"
CONFIG_DIR="/etc/pterodactyl"
WINGS_CONFIG_DIR="/etc/pterodactyl"
LOG_FILE="/var/log/pterodactyl-installer.log"
PANEL_REPO="https://github.com/pterodactyl/panel.git"
WINGS_REPO="https://github.com/pterodactyl/wings.git"

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
    log "INFO: $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log "WARNING: $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log "ERROR: $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Pterodactyl Panel & Wings Installer${NC}"
    echo -e "${BLUE}  Version: $SCRIPT_VERSION${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root"
        exit 1
    fi
}

# Detect operating system and version
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        OS=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
        OS_VERSION=$(lsb_release -sr)
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        OS=$(echo $DISTRIB_ID | tr '[:upper:]' '[:lower:]')
        OS_VERSION=$DISTRIB_RELEASE
    elif [ -f /etc/debian_version ]; then
        OS=debian
        OS_VERSION=$(cat /etc/debian_version)
    else
        print_error "Unable to detect operating system"
        exit 1
    fi

    print_status "Detected OS: $OS $OS_VERSION"
}

# Check if OS is supported
check_supported_os() {
    case $OS in
        ubuntu)
            if [[ "$OS_VERSION" =~ ^(20\.04|22\.04|24\.04)$ ]]; then
                print_status "Ubuntu $OS_VERSION is supported"
                return 0
            else
                print_error "Ubuntu $OS_VERSION is not supported"
                return 1
            fi
            ;;
        debian)
            if [[ $(echo "$OS_VERSION >= 10" | bc -l) -eq 1 ]] 2>/dev/null || [[ "$OS_VERSION" =~ ^(10|11|12)$ ]]; then
                print_status "Debian $OS_VERSION is supported"
                return 0
            else
                print_error "Debian $OS_VERSION is not supported"
                return 1
            fi
            ;;
        arch)
            print_status "Arch Linux is supported"
            return 0
            ;;
        *)
            print_error "$OS is not supported"
            return 1
            ;;
    esac
}

# Update system packages
update_system() {
    print_status "Updating system packages..."
    
    case $OS in
        ubuntu|debian)
            apt update && apt upgrade -y
            ;;
        arch)
            pacman -Syu --noconfirm
            ;;
    esac
}

# Install basic dependencies
install_basic_deps() {
    print_status "Installing basic dependencies..."
    
    case $OS in
        ubuntu|debian)
            apt install -y curl wget git unzip zip software-properties-common \
                apt-transport-https ca-certificates gnupg lsb-release \
                build-essential nginx redis-server
            
            # Add PHP repository for Ubuntu
            if [ "$OS" = "ubuntu" ]; then
                apt install -y software-properties-common
                # For Ubuntu 24.04, use Ondrej's PPA which supports all Ubuntu versions
                LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php
                apt update
            fi
            
            # Install PHP 8.2 and extensions
            apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-mysql \
                php8.2-sqlite3 php8.2-gd php8.2-curl php8.2-mbstring \
                php8.2-xml php8.2-bcmath php8.2-zip php8.2-tokenizer \
                php8.2-redis php8.2-dom php8.2-intl php8.2-fileinfo \
                php8.2-opcache php8.2-pdo php8.2-pdo-mysql composer
            
            # Ensure PHP-FPM service name is correct for Ubuntu 24.04
            if [ "$OS_VERSION" = "24.04" ]; then
                systemctl enable php8.2-fpm
                systemctl start php8.2-fpm
            fi
            ;;
        arch)
            # Install PHP and extensions
            pacman -S --noconfirm php php-fpm php-gd php-curl php-mbstring \
                php-xml php-bcmath php-zip php-sqlite php-redis php-intl \
                php-fileinfo php-opcache composer
            
            # Enable and start PHP-FPM
            systemctl enable php-fpm
            systemctl start php-fpm
            ;;
    esac
}

# Install and configure database
install_database() {
    print_status "Installing and configuring database..."
    
    case $OS in
        ubuntu|debian)
            # Install MariaDB
            apt install -y mariadb-server mariadb-client
            
            # Enable and start MariaDB
            systemctl enable mariadb
            systemctl start mariadb
            
            # Secure MariaDB installation
            mysql_secure_installation <<EOF

y
y
y
y
y
EOF
            ;;
        arch)
            # Install MariaDB
            pacman -S --noconfirm mariadb
            
            # Initialize MariaDB
            mysql_install_db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
            
            # Enable and start MariaDB
            systemctl enable mariadb
            systemctl start mariadb
            
            # Secure MariaDB installation
            mysql_secure_installation <<EOF

y
y
y
y
y
EOF
            ;;
    esac
}

# Create database and user for Pterodactyl
create_database() {
    print_status "Creating database and user for Pterodactyl..."
    
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    # Check if database already exists
    if mysql -u root -e "USE panel;" 2>/dev/null; then
        print_warning "Database 'panel' already exists"
        read -p "Do you want to drop the existing database and recreate it? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            mysql -u root -e "DROP DATABASE panel;"
            print_status "Existing database dropped"
        else
            print_status "Using existing database"
            # Get existing password or ask for new one
            read -s -p "Enter existing database password for pterodactyl user: " DB_PASSWORD_INPUT
            if [ -n "$DB_PASSWORD_INPUT" ]; then
                DB_PASSWORD="$DB_PASSWORD_INPUT"
            fi
        fi
    fi
    
    # Create database if it doesn't exist
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS panel;" 2>/dev/null
    
    # Create user if it doesn't exist
    mysql -u root -e "CREATE USER IF NOT EXISTS 'pterodactyl'@'127.0.0.1' IDENTIFIED BY '$DB_PASSWORD';" 2>/dev/null
    
    # Grant privileges
    mysql -u root -e "GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;" 2>/dev/null
    mysql -u root -e "FLUSH PRIVILEGES;" 2>/dev/null
    
    # Save database credentials
    echo "DB_PASSWORD=$DB_PASSWORD" > "$CONFIG_DIR/database.conf"
    chmod 600 "$CONFIG_DIR/database.conf"
    
    print_status "Database created successfully"
    print_warning "Database password saved to $CONFIG_DIR/database.conf"
}

# Install Node.js and Yarn
install_nodejs() {
    print_status "Installing Node.js and Yarn..."
    
    case $OS in
        ubuntu|debian)
            # Install Node.js 18.x
            curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
            apt-get install -y nodejs
            
            # Install Yarn
            curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
            echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
            apt update
            apt install -y yarn
            ;;
        arch)
            # Install Node.js and Yarn
            pacman -S --noconfirm nodejs npm
            npm install -g yarn
            ;;
    esac
}

# Clone Pterodactyl panel from official repository
install_panel() {
    print_status "Installing Pterodactyl panel from official repository..."
    
    # Create installation directory
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    # Clone the repository
    if [ -d "$INSTALL_DIR/.git" ]; then
        print_status "Repository exists, updating..."
        git pull origin latest
    else
        print_status "Cloning fresh repository..."
        git clone "$OFFICIAL_REPO" .
        git checkout latest
    fi
    
    # Set permissions
    chown -R www-data:www-data "$INSTALL_DIR"
    chmod -R 755 "$INSTALL_DIR"
}

# Configure Pterodactyl panel
configure_panel() {
    print_status "Configuring Pterodactyl panel..."
    
    cd "$INSTALL_DIR"
    
    # Copy environment file
    cp .env.example .env
    
    # Install dependencies
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
    
    # Generate application key
    php artisan key:generate --force
    
    # Get database password
    source "$CONFIG_DIR/database.conf"
    
    # Configure environment
    php artisan p:environment:setup <<EOF
0
0
0
https://pterodactyl.example.com
yes
EOF
    
    # Configure database
    php artisan p:environment:database <<EOF
mysql
127.0.0.1
3306
panel
pterodactyl
$DB_PASSWORD
EOF
    
    # Configure mail (using PHP mail for now)
    php artisan p:environment:mail <<EOF
mail
EOF
    
    # Run migrations and seed
    php artisan migrate --seed --force
    
    # Create admin user
    print_status "Creating admin user..."
    php artisan p:user:make <<EOF
admin
admin@example.com
Admin123!
Admin123!
yes
EOF
    
    # Set permissions
    chown -R www-data:www-data "$INSTALL_DIR"
    chmod -R 755 "$INSTALL_DIR/storage"
    chmod -R 755 "$INSTALL_DIR/bootstrap/cache"
}

# Configure SSL certificates
configure_ssl() {
    print_status "Configuring SSL certificates..."
    
    # Get domain from user
    read -p "Enter your domain name (e.g., example.com): " DOMAIN
    if [ -z "$DOMAIN" ]; then
        print_error "Domain name is required"
        return 1
    fi
    
    # Install Certbot if not present
    if ! command -v certbot >/dev/null 2>&1; then
        print_status "Installing Certbot for Let's Encrypt..."
        case $OS in
            ubuntu|debian)
                apt install -y certbot python3-certbot-nginx
                ;;
            arch)
                pacman -S --noconfirm certbot certbot-nginx
                ;;
        esac
    fi
    
    # Stop Nginx temporarily
    systemctl stop nginx 2>/dev/null || true
    
    # Get SSL certificate
    print_status "Obtaining SSL certificate for $DOMAIN..."
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN"
    
    # Setup auto-renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    # Start Nginx
    systemctl start nginx
    
    print_status "SSL certificate installed and configured for $DOMAIN"
    print_status "Auto-renewal has been configured"
    print_warning "Make sure your domain points to this server's IP"
}

# Configure web server
configure_webserver() {
    print_status "Configuring web server..."
    
    # Create Nginx configuration
    cat > /etc/nginx/sites-available/pterodactyl.conf << 'EOF'
server {
    listen 80;
    server_name pterodactyl.example.com;
    
    root /var/www/pterodactyl/public;
    index index.php index.html index.htm;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.ht {
        deny all;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test and restart Nginx
    nginx -t
    systemctl restart nginx
    systemctl enable nginx
}

# Configure Redis
configure_redis() {
    print_status "Configuring Redis..."
    
    # Enable and start Redis
    systemctl enable redis-server
    systemctl restart redis-server
}

# Configure cron job
configure_cron() {
    print_status "Configuring cron job..."
    
    # Add cron job for Pterodactyl tasks
    (crontab -l 2>/dev/null; echo "* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1") | crontab -
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Install UFW if not present
    if command -v ufw >/dev/null 2>&1; then
        ufw --force enable
        ufw allow ssh
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw allow 22/tcp
        print_status "Firewall configured with UFW"
    else
        print_warning "UFW not available, please configure firewall manually"
    fi
}

# Create systemd services
create_services() {
    print_status "Creating systemd services..."
    
    # Create Pterodactyl worker service
    cat > /etc/systemd/system/pterodactyl-worker.service << 'EOF'
[Unit]
Description=Pterodactyl Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --sleep=3 --tries=3 --max-time=3600

[Install]
WantedBy=multi-user.target
EOF
    
    # Enable and start worker service
    systemctl daemon-reload
    systemctl enable pterodactyl-worker
    systemctl start pterodactyl-worker
}

# Update function
update_panel() {
    print_status "Updating Pterodactyl panel..."
    
    cd "$INSTALL_DIR"
    
    # Backup current installation
    cp .env .env.backup
    tar -czf "/tmp/pterodactyl-backup-$(date +%Y%m%d-%H%M%S).tar.gz" .
    
    # Pull latest changes
    git pull origin latest
    
    # Update dependencies
    COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
    
    # Run migrations
    php artisan migrate --force
    
    # Clear caches
    php artisan cache:clear
    php artisan config:clear
    php artisan view:clear
    
    # Restart services
    systemctl restart pterodactyl-worker
    systemctl restart nginx
    
    print_status "Panel updated successfully"
}

# Installation summary
show_summary() {
    print_header
    echo -e "${GREEN}Installation completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Panel Information:${NC}"
    echo -e "  Installation Directory: $INSTALL_DIR"
    echo -e "  Configuration Directory: $CONFIG_DIR"
    echo -e "  Log File: $LOG_FILE"
    echo ""
    echo -e "${BLUE}Default Admin Account:${NC}"
    echo -e "  Email: admin@example.com"
    echo -e "  Password: Admin123!"
    echo -e "  ${RED}Please change this password immediately!${NC}"
    echo ""
    echo -e "${BLUE}Next Steps:${NC}"
    echo -e "  1. Change your server name in: /etc/nginx/sites-available/pterodactyl.conf"
    echo -e "  2. Configure SSL certificate with Let's Encrypt"
    echo -e "  3. Update the panel URL in the .env file"
    echo -e "  4. Change the admin password"
    echo ""
    echo -e "${BLUE}Services Status:${NC}"
    systemctl status nginx | grep "Active:" | awk '{print "  Nginx: " $2 " " $3}'
    systemctl status php8.2-fpm 2>/dev/null | grep "Active:" | awk '{print "  PHP-FPM: " $2 " " $3}' || systemctl status php-fpm | grep "Active:" | awk '{print "  PHP-FPM: " $2 " " $3}'
    systemctl status redis-server | grep "Active:" | awk '{print "  Redis: " $2 " " $3}'
    systemctl status mariadb | grep "Active:" | awk '{print "  MariaDB: " $2 " $3}'
    systemctl status pterodactyl-worker | grep "Active:" | awk '{print "  Pterodactyl Worker: " $2 " " $3}'
    echo ""
    echo -e "${GREEN}Thank you for using Pterodactyl Panel Installer!${NC}"
}

# Check virtualization compatibility
check_virtualization() {
    print_status "Checking virtualization compatibility..."
    
    # Check if Docker can run
    if command -v systemd-detect-virt >/dev/null 2>&1; then
        VIRT=$(systemd-detect-virt)
        case $VIRT in
            openvz|lxc|ovz)
                print_error "Virtualization type '$VIRT' is not supported for Wings"
                print_error "Wings requires KVM or dedicated hardware"
                return 1
                ;;
            none|kvm|vmware)
                print_status "Virtualization type '$VIRT' is supported"
                ;;
            *)
                print_warning "Unknown virtualization type: $VIRT"
                ;;
        esac
    fi
    
    # Check kernel for Docker compatibility
    KERNEL_VERSION=$(uname -r)
    if [[ "$KERNEL_VERSION" =~ .*-grs-ipv6-64$|.*-mod-std-ipv6-64$ ]]; then
        print_error "Kernel version $KERNEL_VERSION is not compatible with Docker"
        print_error "Please use a standard kernel without modifications"
        return 1
    fi
    
    print_status "Kernel version $KERNEL_VERSION is compatible"
    return 0
}

# Install Docker
install_docker() {
    print_status "Installing Docker..."
    
    # Check if Docker is already installed
    if command -v docker >/dev/null 2>&1; then
        print_status "Docker is already installed"
        return 0
    fi
    
    # Install Docker using official script
    curl -fsSL https://get.docker.com/ | CHANNEL=stable bash
    
    # Enable and start Docker
    systemctl enable --now docker
    
    # Add current user to docker group (optional)
    # usermod -aG docker $USER
    
    print_status "Docker installed successfully"
}

# Configure swap for Docker
configure_swap() {
    print_status "Configuring swap support for Docker..."
    
    # Check if swap account is already enabled
    if grep -q "swapaccount=1" /etc/default/grub 2>/dev/null; then
        print_status "Swap accounting is already enabled"
        return 0
    fi
    
    # Check kernel version (6.1+ has swap enabled by default)
    KERNEL_MAJOR=$(uname -r | cut -d. -f1)
    KERNEL_MINOR=$(uname -r | cut -d. -f2)
    
    if [ "$KERNEL_MAJOR" -gt 6 ] || ([ "$KERNEL_MAJOR" -eq 6 ] && [ "$KERNEL_MINOR" -ge 1 ]); then
        print_status "Kernel version 6.1+ detected, swap is enabled by default"
        return 0
    fi
    
    # Enable swap accounting
    if [ -f /etc/default/grub ]; then
        # Backup GRUB config
        cp /etc/default/grub /etc/default/grub.backup
        
        # Add swapaccount=1 to GRUB_CMDLINE_LINUX_DEFAULT
        if grep -q "^GRUB_CMDLINE_LINUX_DEFAULT=" /etc/default/grub; then
            sed -i 's/^GRUB_CMDLINE_LINUX_DEFAULT="[^"]*/& swapaccount=1/' /etc/default/grub
        else
            echo 'GRUB_CMDLINE_LINUX_DEFAULT="swapaccount=1"' >> /etc/default/grub
        fi
        
        # Update GRUB and reboot prompt
        update-grub
        print_warning "System needs to be rebooted to enable swap accounting"
        print_warning "Please run: sudo reboot"
        read -p "Press Enter to continue after reboot (or skip for now)..."
    else
        print_warning "GRUB configuration not found, swap accounting not configured"
    fi
}

# Install Wings binary
install_wings_binary() {
    print_status "Installing Wings binary..."
    
    # Create directories
    mkdir -p "$WINGS_CONFIG_DIR"
    mkdir -p /var/run/wings
    
    # Determine architecture
    ARCH=$(uname -m)
    case $ARCH in
        x86_64)
            WINGS_ARCH="amd64"
            ;;
        aarch64|arm64)
            WINGS_ARCH="arm64"
            ;;
        *)
            print_error "Unsupported architecture: $ARCH"
            return 1
            ;;
    esac
    
    # Download Wings binary
    WINGS_URL="https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_$WINGS_ARCH"
    curl -L -o /usr/local/bin/wings "$WINGS_URL"
    chmod u+x /usr/local/bin/wings
    
    print_status "Wings binary installed successfully"
}

# Configure Wings
configure_wings() {
    print_status "Configuring Wings..."
    
    # Create basic configuration file template
    cat > "$WINGS_CONFIG_DIR/config.yml" << 'EOF'
# Pterodactyl Wings Configuration
# This file will be overwritten by the panel configuration
# Please configure your node in the panel and copy the configuration here

debug: false
uuid: ""
token_id: ""
token: ""
api:
  host: "0.0.0.0"
  port: 8080
  ssl:
    enabled: false
    cert: ""
    key: ""
  upload_limit: 100
system:
  data: "/var/lib/pterodactyl/volumes"
  sftp:
    bind: "0.0.0.0:2022"
  docker:
    network: "pterodactyl_nw"
    interface: "172.18.0.1"
    timezone: "UTC"
  paths:
    docker: "/usr/bin/docker"
    compose: "/usr/local/bin/docker-compose"
EOF
    
    # Set permissions
    chown -R root:root "$WINGS_CONFIG_DIR"
    chmod 600 "$WINGS_CONFIG_DIR/config.yml"
    
    print_status "Wings configuration template created"
    print_warning "Please configure your node in the panel and update config.yml"
}

# Create Wings systemd service
create_wings_service() {
    print_status "Creating Wings systemd service..."
    
    cat > /etc/systemd/system/wings.service << 'EOF'
[Unit]
Description=Pterodactyl Wings Daemon
After=docker.service
Requires=docker.service
PartOf=docker.service

[Service]
User=root
WorkingDirectory=/etc/pterodactyl
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/local/bin/wings
Restart=on-failure
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable wings
    
    print_status "Wings service created and enabled"
}

# Start Wings service
start_wings() {
    print_status "Starting Wings service..."
    
    # Start Wings in debug mode first to check configuration
    print_status "Testing Wings configuration in debug mode..."
    timeout 30 wings --debug || true
    
    # Start Wings service
    systemctl start wings
    
    # Check service status
    if systemctl is-active --quiet wings; then
        print_status "Wings service started successfully"
    else
        print_error "Wings service failed to start"
        print_status "Check logs with: journalctl -u wings -f"
        return 1
    fi
}

# Update Wings
update_wings() {
    print_status "Updating Wings..."
    
    # Stop Wings service
    systemctl stop wings
    
    # Backup current configuration
    if [ -f "$WINGS_CONFIG_DIR/config.yml" ]; then
        cp "$WINGS_CONFIG_DIR/config.yml" "$WINGS_CONFIG_DIR/config.yml.backup"
    fi
    
    # Update Wings binary
    install_wings_binary
    
    # Restart Wings service
    systemctl start wings
    
    print_status "Wings updated successfully"
}

# Main Wings installation function
install_wings() {
    print_status "Installing Pterodactyl Wings..."
    
    # Check prerequisites
    check_virtualization || exit 1
    install_docker
    configure_swap
    install_wings_binary
    configure_wings
    create_wings_service
    
    print_status "Wings installation completed"
    print_warning "Please configure your node in the panel and update config.yml"
    print_warning "Then run: systemctl start wings"
}

# Main Panel installation function
main_install_panel() {
    print_header
    
    # Check prerequisites
    check_root
    detect_os
    check_supported_os || exit 1
    
    # Create directories
    mkdir -p "$CONFIG_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Installation steps
    update_system
    install_basic_deps
    install_database
    create_database
    install_nodejs
    install_panel
    configure_panel
    configure_webserver
    configure_redis
    configure_cron
    configure_firewall
    create_services
    
    show_summary
}

# Update Panel function
main_update_panel() {
    print_header
    check_root
    detect_os
    update_panel
}

# Uninstall Panel function
main_uninstall_panel() {
    print_header
    check_root
    
    print_warning "This will remove Pterodactyl Panel completely!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping services..."
        systemctl stop pterodactyl-worker nginx redis-server mariadb 2>/dev/null || true
        systemctl disable pterodactyl-worker 2>/dev/null || true
        
        print_status "Removing files..."
        rm -rf "$INSTALL_DIR"
        rm -rf "$CONFIG_DIR"
        rm -f /etc/nginx/sites-available/pterodactyl.conf
        rm -f /etc/nginx/sites-enabled/pterodactyl.conf
        rm -f /etc/systemd/system/pterodactyl-worker.service
        rm -f "$LOG_FILE"
        
        print_status "Removing cron job..."
        crontab -l | grep -v "php /var/www/pterodactyl/artisan schedule:run" | crontab -
        
        print_status "Restarting services..."
        systemctl daemon-reload
        systemctl restart nginx
        
        print_status "Pterodactyl Panel uninstalled successfully"
    else
        print_status "Uninstall cancelled"
    fi
}

# Uninstall Wings function
main_uninstall_wings() {
    print_header
    check_root
    
    print_warning "This will remove Pterodactyl Wings completely!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping Wings service..."
        systemctl stop wings 2>/dev/null || true
        systemctl disable wings 2>/dev/null || true
        
        print_status "Removing Wings files..."
        rm -f /usr/local/bin/wings
        rm -rf "$WINGS_CONFIG_DIR"
        rm -f /etc/systemd/system/wings.service
        rm -rf /var/run/wings
        rm -rf /var/lib/pterodactyl
        
        print_status "Removing Docker networks and containers..."
        docker network rm pterodactyl_nw 2>/dev/null || true
        docker system prune -f 2>/dev/null || true
        
        print_status "Restarting services..."
        systemctl daemon-reload
        
        print_status "Pterodactyl Wings uninstalled successfully"
    else
        print_status "Uninstall cancelled"
    fi
}

# Menu function
show_menu() {
    clear
    print_header
    echo ""
    echo -e "${BLUE}Please select an option:${NC}"
    echo "1) Install Pterodactyl Panel"
    echo "2) Install Pterodactyl Wings"
    echo "3) Install Both Panel & Wings"
    echo "4) Configure SSL Certificate"
    echo "5) Update Pterodactyl Panel"
    echo "6) Update Pterodactyl Wings"
    echo "7) Update Both Panel & Wings"
    echo "8) Uninstall Pterodactyl Panel"
    echo "9) Uninstall Pterodactyl Wings"
    echo "10) Uninstall Both Panel & Wings"
    echo "11) Exit"
    echo ""
    read -p "Enter your choice [1-11]: " choice
    
    case $choice in
        1)
            main_install_panel
            ;;
        2)
            install_wings
            ;;
        3)
            main_install_panel
            install_wings
            ;;
        4)
            configure_ssl
            ;;
        5)
            main_update_panel
            ;;
        6)
            update_wings
            ;;
        7)
            main_update_panel
            update_wings
            ;;
        8)
            main_uninstall_panel
            ;;
        9)
            main_uninstall_wings
            ;;
        10)
            main_uninstall_panel
            main_uninstall_wings
            ;;
        11)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option!"
            show_menu
            ;;
    esac
}

# Script entry point
if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        install-panel)
            main_install_panel
            ;;
        install-wings)
            install_wings
            ;;
        install-both)
            main_install_panel
            install_wings
            ;;
        configure-ssl)
            configure_ssl
            ;;
        update-panel)
            main_update_panel
            ;;
        update-wings)
            update_wings
            ;;
        update-both)
            main_update_panel
            update_wings
            ;;
        uninstall-panel)
            main_uninstall_panel
            ;;
        uninstall-wings)
            main_uninstall_wings
            ;;
        uninstall-both)
            main_uninstall_panel
            main_uninstall_wings
            ;;
        ssl)
            configure_ssl
            ;;
        install)
            main_install_panel
            ;;
        update)
            main_update_panel
            ;;
        uninstall)
            main_uninstall_panel
            ;;
        *)
            echo "Usage: $0 [install-panel|install-wings|install-both|configure-ssl|update-panel|update-wings|update-both|uninstall-panel|uninstall-wings|uninstall-both|ssl]"
            echo "           $0 [install|update|uninstall] (legacy - panel only)"
            exit 1
            ;;
    esac
fi
