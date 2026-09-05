# Network Command Center: IT Support Prototype Guide

Welcome to the prototype guide for the Network Command Center. This document explains exactly how an IT Support Agent would use this system in a real-life day-to-day scenario.

## The Scenario

Imagine you are an IT Support Agent responsible for managing remote access for employees, maintaining the central office print server, and ensuring the company's file storage is online.

Normally, if an employee can't connect to the VPN, you would have to:
1. Open a terminal.
2. SSH into the production server.
3. Run `docker ps` to see if the container crashed.
4. Run `docker logs wireguard` to read the error output.

**With this prototype, you can do all of that from a single web browser window.**

## How to use the Prototype

### Step 1: Launching the Command Center
As an administrator, you navigate to the internal URL of the dashboard (in this prototype, `http://localhost:5173`).

### Step 2: Morning Health Check
When the dashboard loads, the **Node.js backend** automatically queries the Docker daemon. 
* Look at the top right of each card.
* If Nextcloud Storage says **"ONLINE"** with a green dot, you immediately know the company file server is healthy.
* If a service says **"OFFLINE"** with a red dot, you know a container has crashed before users even start submitting support tickets.

### Step 3: Troubleshooting a Crash (Log Viewer)
Suppose the Nextcloud Storage card turns **OFFLINE**.
1. You do **not** need to open an SSH terminal.
2. Simply click the **"View App Logs"** button on the Storage card.
3. A terminal window will instantly pop up on your screen. The Node.js backend streams the actual `stdout` and `stderr` logs directly from the Docker container to your browser.
4. You can immediately identify if it was a database connection error or an out-of-memory issue by reading the text.

### Step 4: Onboarding a New Employee (VPN Access)
A new employee needs access to the company network today.
1. Go to the **WireGuard VPN** card on the dashboard.
2. In the "New Peer Name" box, type `employee-john-doe-laptop`.
3. Click **"Generate Config"**.
4. The dashboard sends a secure request to the backend. The backend executes the configuration script on the host server.
5. The UI will display a success message and a QR code placeholder. In the real production environment, you would scan this QR code with the employee's laptop to instantly connect them to the VPN.

### Step 5: Managing Printers
An employee reports a paper jam on the second floor.
1. Go to the **CUPS Print Server** card.
2. Click **"Open Admin UI"**.
3. You are immediately redirected to the native CUPS administration portal (`https://localhost:631`) where you can clear the print queue or restart the specific printer.

## Why this Prototype Matters

This prototype demonstrates a massive reduction in "Time To Resolution" (TTR) for IT support tickets. By centralizing monitoring, log viewing, and remote execution into a single React interface, support agents can diagnose and fix infrastructure issues exponentially faster than using traditional command-line methods.
