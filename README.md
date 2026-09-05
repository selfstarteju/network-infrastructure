# Network Infrastructure

A modular, self-hosted network infrastructure system managed via Infrastructure as Code (IaC) and a centralized React dashboard. This project provides a complete suite of services for secure remote access, centralized printing, and self-hosted cloud storage.

![React Dashboard Preview](dashboard/screenshot-placeholder.png) <!-- Replace with an actual screenshot of the dashboard when pushing to GitHub -->

## Architecture

The project is divided into three isolated domains, each containerized or scripted for rapid, secure deployment on any modern Linux host.

1. **VPN & Remote Access (`/vpn`)**: A WireGuard VPN server deployed via Docker Compose. It routes all traffic securely, featuring dynamic client config generation scripts.
2. **File Server & Storage (`/storage`)**: A Nextcloud instance backed by PostgreSQL. The database is isolated on an internal Docker network, ensuring no exposure of DB ports to the host.
3. **Print Server (`/print`)**: An automated bash script that installs and configures a CUPS server, complete with UFW firewall rules and subnet-restricted admin UI access.
4. **Command Center Dashboard (`/dashboard`)**: A sleek, React + Vite based management UI to monitor services and provide quick access to administrative panels.

## Technology Stack

- **Containerization:** Docker, Docker Compose
- **Scripting & Automation:** Bash, `sed`, `ufw`
- **Frontend Dashboard:** React, Vite, Vanilla CSS (Glassmorphism design)
- **Services:** WireGuard, Nextcloud, PostgreSQL, CUPS

## Deployment Instructions

### Prerequisites
- A Linux host (Debian/Ubuntu recommended for CUPS)
- Docker and Docker Compose installed
- Port 51820 (UDP) forwarded on your edge router for WireGuard
- Node.js (for the Dashboard)

### 1. Deploying the Storage Server
```bash
cd storage
chmod +x generate-env.sh
./generate-env.sh
docker-compose up -d
```
Access Nextcloud at `http://<host-ip>:8080`.

### 2. Deploying the VPN
```bash
cd vpn
docker-compose up -d
./generate-client.sh 1
```

### 3. Deploying the Print Server
Transfer the script to your target print server machine:
```bash
cd print
sudo ./setup-cups.sh
```
Access the CUPS Admin UI at `https://<host-ip>:631`.

### 4. Running the Dashboard
To start the React dashboard locally:
```bash
cd dashboard
npm install
npm run dev
```

## Security Best Practices
- Database passwords are cryptographically generated using `/dev/urandom`.
- The PostgreSQL database does not publish its port to the host machine.
- The CUPS Admin interface is restricted to local subnets via `cupsd.conf`.
- WireGuard provides end-to-end encryption for all remote traffic.

## License
MIT License
