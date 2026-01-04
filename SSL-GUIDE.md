# SSL Certificate Setup Guide

## 🚀 Quick SSL Setup

### Method 1: Use Installer SSL Option
```bash
sudo ./pterodactyl-installer.sh configure-ssl
# or
sudo ./pterodactyl-installer.sh ssl
```

### Method 2: Manual SSL Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Setup auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## 📋 SSL Configuration Options

The installer now includes:
- ✅ **Option 4**: Configure SSL Certificate
- ✅ **Let's Encrypt** integration
- ✅ **Auto-renewal** setup
- ✅ **Domain validation**
- ✅ **Nginx** configuration

## 🔧 Manual SSL Configuration

### Step 1: Update Nginx Config
Edit `/etc/nginx/sites-available/pterodactyl.conf`:
```nginx
server_name your-domain.com;
```

### Step 2: Get Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

### Step 3: Update Panel URL
Edit `/var/www/pterodactyl/.env`:
```env
APP_URL=https://your-domain.com
```

## 🛠️ SSL Troubleshooting

### Issue: Domain not pointing to server
```bash
# Check DNS
nslookup your-domain.com
dig your-domain.com
```

### Issue: Port 80 blocked
```bash
# Check firewall
sudo ufw status
sudo ufw allow 80
sudo ufw allow 443
```

### Issue: Certificate renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

## 🔒 SSL Best Practices

1. **Use HTTPS only** after SSL setup
2. **Update panel URL** in .env file
3. **Setup auto-renewal** (included)
4. **Monitor certificate expiry**
5. **Use strong ciphers** (configured automatically)

## 📊 SSL Status Check

```bash
# Check certificate status
sudo certbot certificates

# Check Nginx SSL config
sudo nginx -t

# Test SSL connection
openssl s_client -connect your-domain.com:443
```

## 🔄 Auto-Renewal

The installer automatically sets up cron job:
```bash
# View cron job
sudo crontab -l | grep certbot

# Manual renewal test
sudo certbot renew --dry-run
```

## 🌐 SSL for Wings

For Wings SSL, update `/etc/pterodactyl/config.yml`:
```yaml
api:
  ssl:
    enabled: true
    cert: "/etc/letsencrypt/live/your-domain.com/fullchain.pem"
    key: "/etc/letsencrypt/live/your-domain.com/privkey.pem"
```

## ✅ SSL Verification

After setup, verify:
1. ✅ HTTPS works in browser
2. ✅ Green padlock appears
3. ✅ No mixed content warnings
4. ✅ Certificate valid
5. ✅ Auto-renewal configured

The installer handles all SSL setup automatically!
