# VPN & Remote Access (WireGuard)

This directory contains the deployment configuration for a WireGuard VPN server using the `linuxserver/wireguard` Docker image.

## Prerequisites

- Docker and Docker Compose installed on your host.
- A static public IP address or Dynamic DNS configured for your network.

## Deployment

1. **Review Configuration:** Open `docker-compose.yml` and adjust settings if necessary (e.g., `TZ`, `SERVERURL`, `PEERS`).
2. **Start the VPN:** Run the following command in this directory:
   ```bash
   docker-compose up -d
   ```
3. **Port Forwarding:** To allow clients to connect from the internet, you MUST configure port forwarding on your edge router/firewall.
   - **Protocol:** UDP
   - **External Port:** 51820
   - **Internal IP:** `<IP of the Docker host>`
   - **Internal Port:** 51820

## Client Configuration

The container automatically generates client configurations based on the `PEERS` environment variable.

You can use the included script to view a client's configuration:
```bash
./generate-client.sh 1
```

To display a QR code in your terminal to easily scan it with the WireGuard mobile app:
```bash
docker exec -it wireguard /app/show-peer 1
```
