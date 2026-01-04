# Pterodactyl Panel & Wings Installation Guide

## Quick Installation (Ubuntu 24.04)

### Method 1: Direct Installation (Recommended for Testing)

1. **Upload files to your server:**
```bash
# Upload all files to your server using scp or sftp
scp -r pterodactyl-installer/ root@your-server:/root/
```

2. **Run the installer directly:**
```bash
cd /root/pterodactyl-installer
chmod +x pterodactyl-installer.sh
sudo ./pterodactyl-installer.sh
```

### Method 2: Local Installation

1. **Download the files:**
```bash
wget https://github.com/LukePamlerr/pterodactyl-installer/archive/main.zip
unzip main.zip
cd pterodactyl-installer-main
```

2. **Run the installer:**
```bash
chmod +x pterodactyl-installer.sh
sudo ./pterodactyl-installer.sh
```

### Method 3: One-line Installation

```bash
bash <(curl -s https://raw.githubusercontent.com/LukePamlerr/pterodactyl-installer/main/pterodactyl-installer.sh)
```

## Ubuntu 24.04 Specific Fixes

The installer includes specific fixes for Ubuntu 24.04:

1. **PHP Repository**: Uses Ondrej's PPA which supports Ubuntu 24.04
2. **PHP-FPM Service**: Ensures correct service name and startup
3. **Package Dependencies**: Updated package lists for 24.04 compatibility

## Installation Options

When you run the installer, you'll see:

```
================================
  Pterodactyl Panel & Wings Installer
  Version: 1.0.0
================================

Please select an option:
1) Install Pterodactyl Panel
2) Install Pterodactyl Wings
3) Install Both Panel & Wings
4) Update Pterodactyl Panel
5) Update Pterodactyl Wings
6) Update Both Panel & Wings
7) Uninstall Pterodactyl Panel
8) Uninstall Pterodactyl Wings
9) Uninstall Both Panel & Wings
10) Exit
```

## Command Line Options

You can also use command line options:

```bash
# Install Panel only
sudo ./pterodactyl-installer.sh install-panel

# Install Wings only
sudo ./pterodactyl-installer.sh install-wings

# Install both
sudo ./pterodactyl-installer.sh install-both

# Update Panel
sudo ./pterodactyl-installer.sh update-panel

# Update Wings
sudo ./pterodactyl-installer.sh update-wings
```

## Troubleshooting Ubuntu 24.04

### Issue: PHP Repository Not Found
```bash
# Fix: Add the PPA manually
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
```

### Issue: PHP-FPM Service Not Starting
```bash
# Check service status
sudo systemctl status php8.2-fpm

# Start manually if needed
sudo systemctl start php8.2-fpm
sudo systemctl enable php8.2-fpm
```

### Issue: Permission Denied
```bash
# Ensure running as root
sudo su
# or
sudo ./pterodactyl-installer.sh
```

### Issue: Docker Not Installing (Wings)
```bash
# Install Docker manually
curl -fsSL https://get.docker.com/ | CHANNEL=stable bash
sudo systemctl enable --now docker
```

## Post-Installation Steps

### For Panel:
1. **Update domain name** in `/etc/nginx/sites-available/pterodactyl.conf`
2. **Configure SSL** with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```
3. **Update panel URL** in `/var/www/pterodactyl/.env`
4. **Change admin password** immediately

### For Wings:
1. **Create node** in your Panel admin interface
2. **Copy configuration** from Panel to `/etc/pterodactyl/config.yml`
3. **Start Wings**: `sudo systemctl start wings`

## Default Credentials

- **Panel Admin**: admin@example.com / Admin123!
- **Database**: pterodactyl / (random password in `/etc/pterodactyl/database.conf`)

⚠️ **Change all default passwords immediately!**

## File Locations

- **Panel**: `/var/www/pterodactyl/`
- **Wings Config**: `/etc/pterodactyl/config.yml`
- **Nginx Config**: `/etc/nginx/sites-available/pterodactyl.conf`
- **Logs**: `/var/log/pterodactyl-installer.log`

## Service Management

```bash
# Panel services
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status redis-server
sudo systemctl status mariadb
sudo systemctl status pterodactyl-worker

# Wings service
sudo systemctl status wings
```

## Support

If you encounter issues:

1. Check the logs: `tail -f /var/log/pterodactyl-installer.log`
2. Verify service status: `systemctl status [service-name]`
3. Check system requirements: `uname -r` and `systemd-detect-virt`

## Repository URL Setup

To use the one-line installer, replace `YOUR_USERNAME` in the URL with your actual GitHub username:

```bash
bash <(curl -s https://raw.githubusercontent.com/YOUR_USERNAME/pterodactyl-installer/main/pterodactyl-installer.sh)
```

Or upload the files to your own repository and update the URL accordingly.
