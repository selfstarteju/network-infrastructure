#!/bin/bash

# Simple script to show client configs for the linuxserver/wireguard container
# Assuming the container name is 'wireguard'

if [ -z "$1" ]; then
  echo "Usage: $0 <peer_number>"
  echo "Example: $0 1 (for peer1)"
  exit 1
fi

PEER="peer$1"
CONFIG_FILE="./config/peer$1/peer$1.conf"
PNG_FILE="./config/peer$1/peer$1.png"

echo "=== Config for $PEER ==="
if [ -f "$CONFIG_FILE" ]; then
  cat "$CONFIG_FILE"
  echo ""
  echo "QR Code is available at: $PNG_FILE"
  echo "You can also view the QR code in terminal by running:"
  echo "docker exec -it wireguard /app/show-peer $1"
else
  echo "Config file not found: $CONFIG_FILE"
  echo "Please ensure the container is running and the peer was created."
fi
