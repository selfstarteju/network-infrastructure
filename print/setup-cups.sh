#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Default allowed subnet (can be overridden with the first argument)
ALLOWED_SUBNET=${1:-"192.168.1.*"}

echo "Starting CUPS Server setup..."

# 1. Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root (e.g. using sudo)."
  exit 1
fi

# 2. Update packages and install CUPS
echo "Installing CUPS and related packages..."
apt-get update
apt-get install -y cups cups-client

# 3. Add current user (if running via sudo) to the lpadmin group
if [ -n "$SUDO_USER" ]; then
    usermod -aG lpadmin "$SUDO_USER"
    echo "Added user $SUDO_USER to the lpadmin group."
fi

# 4. Configure UFW firewall
echo "Configuring firewall (UFW)..."
if command -v ufw >/dev/null 2>&1; then
    ufw allow 631/tcp
    ufw allow 631/udp
    echo "UFW rules added for port 631."
else
    echo "UFW is not installed. Skipping firewall configuration."
    echo "Please ensure port 631 is open on your firewall."
fi

# 5. Backup the original CUPS configuration
cp /etc/cups/cupsd.conf /etc/cups/cupsd.conf.bak

# 6. Configure CUPS for network access and web interface access
echo "Configuring CUPS to allow access from $ALLOWED_SUBNET..."

# Stop CUPS while configuring
systemctl stop cups

# Use sed to modify the cupsd.conf
# Listen on all interfaces
sed -i 's/Listen localhost:631/Port 631/g' /etc/cups/cupsd.conf

# Enable browsing
sed -i 's/Browsing Off/Browsing On/g' /etc/cups/cupsd.conf

# Allow access to the server
sed -i "/<Location \/>/,/<\/Location>/ s/Order allow,deny/Order allow,deny\n  Allow from $ALLOWED_SUBNET/" /etc/cups/cupsd.conf

# Allow access to the admin pages
sed -i "/<Location \/admin>/,/<\/Location>/ s/Order allow,deny/Order allow,deny\n  Allow from $ALLOWED_SUBNET/" /etc/cups/cupsd.conf

# Allow access to configuration files
sed -i "/<Location \/admin\/conf>/,/<\/Location>/ s/Order allow,deny/Order allow,deny\n  Allow from $ALLOWED_SUBNET/" /etc/cups/cupsd.conf

# 7. Start and enable CUPS service
echo "Starting CUPS service..."
systemctl start cups
systemctl enable cups

echo "CUPS setup complete!"
echo "You should now be able to access the web interface at https://<server-ip>:631"
