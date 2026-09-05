# Print Server (CUPS)

This directory contains the automated setup script for a Common UNIX Printing System (CUPS) server.

## Purpose

The setup script automates the installation and configuration of CUPS on a Debian/Ubuntu-based Linux system. It enables network access to the printing service and the administrative web interface.

## Usage

You must execute the setup script on the target Linux machine that will act as the print server.

1. **Copy the Script:** Transfer the `setup-cups.sh` script to the target machine.
2. **Make it Executable:**
   ```bash
   chmod +x setup-cups.sh
   ```
3. **Execute the Script (requires root privileges):**
   ```bash
   sudo ./setup-cups.sh [SUBNET]
   ```
   *Optional:* Provide a subnet as the first argument to restrict web interface access (default is `192.168.1.*`).
   Example: `sudo ./setup-cups.sh "10.0.0.*"`

## What the script does

1. Installs the `cups` and `cups-client` packages via `apt`.
2. Adds the user running the script via `sudo` to the `lpadmin` group, which allows printer management.
3. Opens port 631 (TCP and UDP) using Uncomplicated Firewall (`ufw`).
4. Modifies `/etc/cups/cupsd.conf` to:
   - Listen on all network interfaces instead of just localhost.
   - Enable printer browsing across the network.
   - Allow administrative access from the specified local subnet.
5. Restarts and enables the CUPS service on boot.

## Administration

After successful setup, you can access the CUPS administration interface via a web browser from any machine on the allowed subnet:
`https://<print-server-ip>:631`

**Note:** CUPS uses HTTPS for administration, but uses a self-signed certificate. You may need to ignore the browser warning to proceed. Use the username and password of a user in the `lpadmin` group (like the one you used to run the script via `sudo`) to log in.
