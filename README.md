# Pterodactyl Panel Installer

A comprehensive, multi-distribution installer script for Pterodactyl Panel that supports Ubuntu 20.04/22.04/24.04, Debian 10+, and Arch Linux.

## Features

- **Multi-distribution support**: Ubuntu 20.04, 22.04, 24.04 / Debian 10+ / Arch Linux
- **Official repository**: Automatically pulls from the official Pterodactyl GitHub repository
- **Auto-update functionality**: Built-in update mechanism to keep your panel current
- **Complete installation**: Installs and configures all required dependencies
- **Security focused**: Configures firewall, secure permissions, and security headers
- **Modular design**: Separate configuration files for easy customization
- **Error handling**: Comprehensive logging and error reporting
- **Interactive menu**: User-friendly installation and management interface

## Supported Operating Systems

| Distribution | Versions | Status |
|--------------|----------|---------|
| Ubuntu | 20.04, 22.04, 24.04 | ✅ Supported |
| Debian | 10, 11, 12+ | ✅ Supported |
| Arch Linux | Latest | ✅ Supported |

## Requirements

- Root access or sudo privileges
- Minimum 2GB RAM (4GB recommended)
- At least 20GB disk space
- Internet connection
- Supported Linux distribution

## Quick Start

### Download and Run

```bash
# Download the installer
wget https://raw.githubusercontent.com/your-repo/pterodactyl-installer/main/pterodactyl-installer.sh

# Make it executable
chmod +x pterodactyl-installer.sh

# Run the installer
sudo ./pterodactyl-installer.sh
```

### One-line Installation

```bash
bash <(curl -s https://raw.githubusercontent.com/your-repo/pterodactyl-installer/main/pterodactyl-installer.sh)
```

## Usage

The installer provides an interactive menu with the following options:

1. **Install Pterodactyl Panel** - Complete fresh installation
2. **Update Pterodactyl Panel** - Update existing installation
3. **Uninstall Pterodactyl Panel** - Complete removal
4. **Exit** - Exit the installer

### Command Line Options

```bash
# Install the panel
sudo ./pterodactyl-installer.sh install

# Update existing installation
sudo ./pterodactyl-installer.sh update

# Uninstall the panel
sudo ./pterodactyl-installer.sh uninstall
```

## What Gets Installed

### System Components
- Nginx web server
- PHP 8.2 with required extensions
- MariaDB database server
- Redis cache server
- Node.js and Yarn
- Composer (PHP package manager)

### Pterodactyl Components
- Latest Pterodactyl Panel from official repository
- Queue worker service
- Cron job for scheduled tasks
- SSL-ready configuration
- Security headers and optimizations

### Security Features
- UFW firewall configuration
- Secure file permissions
- Database user with limited privileges
- Security headers in Nginx
- Encrypted session storage

## Configuration Files

The installer creates and manages several configuration files:

- `/etc/pterodactyl/` - Main configuration directory
- `/var/www/pterodactyl/` - Panel installation directory
- `/etc/nginx/sites-available/pterodactyl.conf` - Nginx configuration
- `/etc/systemd/system/pterodactyl-worker.service` - Worker service
- `/var/log/pterodactyl-installer.log` - Installation log

### Template Files

The `config/` directory contains template files:

- `pterodactyl.conf` - Environment configuration template
- `nginx-pterodactyl.conf` - Nginx configuration template
- `pterodactyl-worker.service` - Systemd service template
- `pterodactyl-cron.conf` - Cron job configuration

## Post-Installation Steps

After installation, you should:

1. **Update your domain name** in `/etc/nginx/sites-available/pterodactyl.conf`
2. **Configure SSL certificate** using Let's Encrypt
3. **Update the panel URL** in `/var/www/pterodactyl/.env`
4. **Change the default admin password** immediately
5. **Configure email settings** for notifications

### Default Admin Account

- **Email**: admin@example.com
- **Password**: Admin123!
- **⚠️ Change this password immediately!**

## SSL Configuration

### Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Enable auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Update Process

The installer handles updates automatically:

1. **Backup** current installation
2. **Pull** latest changes from official repository
3. **Update** dependencies
4. **Run** database migrations
5. **Clear** caches
6. **Restart** services

## Troubleshooting

### Common Issues

**Permission Denied**
```bash
# Ensure running as root
sudo ./pterodactyl-installer.sh
```

**Database Connection Failed**
```bash
# Check MariaDB status
sudo systemctl status mariadb

# Check database credentials
sudo cat /etc/pterodactyl/database.conf
```

**Nginx Configuration Error**
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Log Files

- `/var/log/pterodactyl-installer.log` - Installation log
- `/var/log/nginx/pterodactyl_error.log` - Nginx error log
- `/var/www/pterodactyl/storage/logs/` - Application logs

### Service Management

```bash
# Check service status
sudo systemctl status pterodactyl-worker
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status redis-server
sudo systemctl status mariadb

# Restart services
sudo systemctl restart pterodactyl-worker
sudo systemctl restart nginx
```

## Security Recommendations

1. **Regular Updates**: Keep your system and panel updated
2. **Strong Passwords**: Use strong, unique passwords
3. **SSL Certificate**: Always use HTTPS in production
4. **Firewall**: Keep firewall enabled and properly configured
5. **Backups**: Regular database and file backups
6. **Monitoring**: Monitor logs and service status

## Uninstallation

The installer provides a complete uninstall option that:

- Stops and disables all services
- Removes all files and configurations
- Cleans up cron jobs
- Preserves user data (optional)

## Support

For issues related to:
- **Installer script**: Create an issue in this repository
- **Pterodactyl Panel**: Visit [Pterodactyl Discord](https://discord.gg/pterodactyl)
- **Documentation**: [Pterodactyl Documentation](https://pterodactyl.io/)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This installer is licensed under the MIT License. Pterodactyl Panel is licensed under its own terms.

## Disclaimer

This installer is not officially affiliated with Pterodactyl. Always review the official documentation and follow security best practices.

---

**⚠️ Important**: Always backup your data before performing installations, updates, or modifications.
