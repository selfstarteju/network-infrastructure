const express = require('express');
const cors = require('cors');
const Docker = require('dockerode');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3001;
// Initialize Docker connection (defaults to local socket/pipe on Windows/Linux)
const docker = new Docker();

app.use(cors());
app.use(express.json());

// Helper to check if docker is accessible
const checkDocker = async () => {
    try {
        await docker.ping();
        return true;
    } catch (e) {
        return false;
    }
};

// 1. Live Status Endpoint
app.get('/api/status', async (req, res) => {
    const isDockerUp = await checkDocker();
    
    if (!isDockerUp) {
        // Fallback for local development when Docker isn't running
        return res.json({
            vpn: { status: 'offline', state: 'unreachable' },
            storage: { status: 'offline', state: 'unreachable' },
            print: { status: 'online', state: 'local' }
        });
    }

    try {
        const containers = await docker.listContainers({ all: true });
        const vpnContainer = containers.find(c => c.Names.includes('/wireguard'));
        const nextcloudContainer = containers.find(c => c.Names.includes('/nextcloud_app'));

        res.json({
            vpn: {
                status: vpnContainer && vpnContainer.State === 'running' ? 'online' : 'offline',
                state: vpnContainer ? vpnContainer.State : 'not_found'
            },
            storage: {
                status: nextcloudContainer && nextcloudContainer.State === 'running' ? 'online' : 'offline',
                state: nextcloudContainer ? nextcloudContainer.State : 'not_found'
            },
            print: { status: 'online', state: 'local' } // Assuming Print runs directly on host
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch container status' });
    }
});

// 2. Logs Streaming Endpoint
app.get('/api/logs/:container', async (req, res) => {
    const containerName = req.params.container;
    const isDockerUp = await checkDocker();

    if (!isDockerUp) {
        return res.json({ logs: `[MOCK LOGS]\nWaiting for Docker daemon...\nUnable to connect to ${containerName}.` });
    }

    try {
        const container = docker.getContainer(containerName);
        const logs = await container.logs({
            stdout: true,
            stderr: true,
            tail: 50,
            timestamps: true
        });
        // Dockerode returns logs with a custom header, clean it up for basic text view
        const cleanLogs = logs.toString('utf8').replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '');
        res.json({ logs: cleanLogs || 'No logs available.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch logs', details: err.message });
    }
});

// 3. VPN Generate Endpoint
app.post('/api/vpn/generate', (req, res) => {
    const { peerName } = req.body;
    
    if (!peerName) {
        return res.status(400).json({ error: 'Peer name is required' });
    }

    // In a real environment, you might append the peer to the docker-compose file or run a script.
    // Here we simulate the process or run a placeholder script.
    const scriptPath = path.resolve(__dirname, '../vpn/generate-client.sh');
    
    // Simulate generation for demo purposes since we might not be on a Linux host
    setTimeout(() => {
        res.json({
            success: true,
            message: `Peer ${peerName} generated successfully!`,
            configData: `[Interface]\nPrivateKey = ...\nAddress = 10.13.13.X/32\n\n[Peer]\nPublicKey = ...\nEndpoint = server_ip:51820\nAllowedIPs = 0.0.0.0/0`
        });
    }, 1500);
});

app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
});
