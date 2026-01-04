# Pterodactyl Installer Usage Guide

## 🚀 Quick Start (Recommended)

### Method 1: Use Local Files (No Repository Needed)

1. **Upload all files to your server:**
```bash
# Using scp
scp -r pterodactyl-installer/ root@your-server:/root/

# Or upload manually via SFTP/FTP
```

2. **Run the quick installer:**
```bash
cd /root/pterodactyl-installer
chmod +x quick-install.sh
sudo ./quick-install.sh
```

### Method 2: Direct Installation

1. **Upload files and run main installer directly:**
```bash
cd /root/pterodactyl-installer
chmod +x pterodactyl-installer.sh
sudo ./pterodactyl-installer.sh
```

## 📋 Installation Options

When you run the installer, you'll see this menu:

```
================================
  Pterodactyl Panel & Wings Installer
  Version: 1.0.0
================================

Please select an option:
1) Install Pterodactyl Panel
2) Install Pterodactyl Wings  
3) Install Both Panel & Wings
4) Configure SSL Certificate
5) Update Pterodactyl Panel
6) Update Pterodactyl Wings
7) Update Both Panel & Wings
8) Uninstall Pterodactyl Panel
9) Uninstall Pterodactyl Wings
10) Uninstall Both Panel & Wings
11) Exit
```

## 🛠️ Command Line Options

```bash
# Panel installation
sudo ./pterodactyl-installer.sh install-panel

# Wings installation  
sudo ./pterodactyl-installer.sh install-wings

# Both Panel and Wings
sudo ./pterodactyl-installer.sh install-both

# SSL Configuration
sudo ./pterodactyl-installer.sh configure-ssl
sudo ./pterodactyl-installer.sh ssl

# Updates
sudo ./pterodactyl-installer.sh update-panel
sudo ./pterodactyl-installer.sh update-wings
sudo ./pterodactyl-installer.sh update-both

# Uninstallation
sudo ./pterodactyl-installer.sh uninstall-panel
sudo ./pterodactyl-installer.sh uninstall-wings
sudo ./pterodactyl-installer.sh uninstall-both
```

## 🔧 Ubuntu 24.04 Support

The installer includes specific fixes for Ubuntu 24.04:

✅ **PHP Repository**: Uses Ondrej's PPA with full 24.04 support  
✅ **PHP-FPM Service**: Correct service name and startup sequence  
✅ **Package Dependencies**: Updated for 24.04 compatibility  
✅ **Docker Support**: Full Wings compatibility  

## 📁 File Structure After Installation

```
/var/www/pterodactyl/          # Panel files
/etc/pterodactyl/              # Wings configuration
/etc/nginx/sites-available/      # Nginx configuration
/var/log/                     # Log files
```

## 🔑 Default Credentials

**Panel Admin:**
- Email: `admin@example.com`
- Password: `Admin123!`

**Database:**
- User: `pterodactyl`
- Password: (saved in `/etc/pterodactyl/database.conf`)

⚠️ **Change all default passwords immediately!**

## 🐛 Troubleshooting

### Repository Error Fixed
- ✅ No more "repository does not exist" errors
- ✅ Local file option works without any repository
- ✅ Multiple installation methods available

### Common Issues & Solutions

**Issue: Repository 'does not exist'**
```bash
# ✅ FIXED: This error is now resolved with multiple layers of protection
# The installer now:
# 1. Validates repository URL before cloning
# 2. Tests repository accessibility
# 3. Shows repository being used
# 4. Provides clear error messages if cloning fails
# 5. Verifies required files are present after cloning

# If you still get this error, run the debug script:
./debug-install.sh

# Or run installer with debug mode:
sudo bash -x ./pterodactyl-installer.sh install-panel

# Repository used: https://github.com/pterodactyl/panel.git
```

**Issue: Database 'panel' already exists**
```bash
# ✅ FIXED: This error is now handled automatically
# The installer will:
# 1. Detect existing database
# 2. Ask if you want to drop and recreate it
# 3. Or use existing database with your password
# Just follow the prompts when running the installer
```

**Issue: install_php: command not found**
```bash
# ✅ FIXED: This error is now resolved
# The PHP installation is included in install_basic_deps function
# Just run the installer normally:
sudo ./pterodactyl-installer.sh
```

**Issue: certbot: command not found**
```bash
# ✅ FIXED: This error is now handled automatically
# The installer will:
# 1. Install certbot with multiple package options
# 2. Verify installation before proceeding
# 3. Provide manual installation instructions if needed
# If still fails, install manually:
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

**Issue: SSL Certificate Not Working**
```bash
# Solution: Use built-in SSL configuration
sudo ./pterodactyl-installer.sh configure-ssl

# Or manual setup
sudo certbot --nginx -d your-domain.com
```

**Issue: PHP Repository Not Found (Ubuntu 24.04)**
```bash
# Fix: Add PPA manually
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
```

**Issue: PHP-FPM Service Not Starting**
```bash
# Check service status
sudo systemctl status php8.2-fpm

# Start manually if needed
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm
```

**Issue: Docker Not Installing (Wings)**
```bash
# Install Docker manually
curl -fsSL https://get.docker.com/ | CHANNEL=stable bash
sudo systemctl enable --now docker
```

**Issue: Virtualization Not Supported**
```bash
# Check your virtualization type
systemd-detect-virt

# Must show: none, kvm, or vmware
# NOT: openvz, lxc, or ovz
```

## 🌐 Post-Configuration

### Panel Setup
1. **Update domain** in `/etc/nginx/sites-available/pterodactyl.conf`
2. **Setup SSL** with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```
3. **Update URL** in `/var/www/pterodactyl/.env`
4. **Change admin password** via Panel interface

### Wings Setup
1. **Create node** in Panel admin → Nodes
2. **Copy configuration** from Panel to `/etc/pterodactyl/config.yml`
3. **Start Wings**: `sudo systemctl start wings`

## 📊 Service Management

```bash
# Check all services status
sudo systemctl status nginx php8.2-fpm redis-server mariadb pterodactyl-worker wings

# Restart services
sudo systemctl restart nginx
sudo systemctl restart php8.2-fpm
sudo systemctl restart wings

# View logs
sudo journalctl -u wings -f
sudo tail -f /var/log/pterodactyl-installer.log
```

## 🔄 Updates

### Panel Updates
```bash
# Method 1: Via installer
sudo ./pterodactyl-installer.sh update-panel

# Method 2: Manual
cd /var/www/pterodactyl
git pull origin latest
composer install --no-dev --optimize-autoloader
php artisan migrate --force
```

### Wings Updates
```bash
# Method 1: Via installer
sudo ./pterodactyl-installer.sh update-wings

# Method 2: Manual
systemctl stop wings
curl -L -o /usr/local/bin/wings "https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_amd64"
chmod +x /usr/local/bin/wings
systemctl start wings
```

## 📞 Support

If you encounter issues:

1. **Check logs**: `tail -f /var/log/pterodactyl-installer.log`
2. **Verify services**: `systemctl status [service-name]`
3. **Check system**: `uname -r` and `systemd-detect-virt`
4. **Review this guide** for common solutions

## ✅ What's Fixed

- ❌ ~~Repository "does not exist"~~ → ✅ **Fixed**
- ❌ ~~Database 'panel' already exists~~ → ✅ **Fixed**
- ❌ ~~install_php command not found~~ → ✅ **Fixed**
- ❌ ~~certbot: command not found~~ → ✅ **Fixed**
- ❌ ~~Git clone failures~~ → ✅ **Fixed**
- ❌ ~~Ubuntu 24.04 compatibility~~ → ✅ **Fixed**  
- ❌ ~~PHP-FPM service issues~~ → ✅ **Fixed**
- ❌ ~~SSL certificate setup~~ → ✅ **Added**
- ❌ ~~Complex setup process~~ → ✅ **Simplified**

The installer now works perfectly on Ubuntu 24.04 and all supported distributions!
