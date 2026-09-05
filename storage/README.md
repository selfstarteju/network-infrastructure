# File Server & Storage (Nextcloud)

This directory contains the deployment configuration for a Nextcloud instance backed by a robust PostgreSQL database.

## Architecture

- **Nextcloud App:** Serves the web interface and handles file management (exposed on host port 8080).
- **PostgreSQL Database:** Provides robust data storage for Nextcloud metadata. It is completely isolated on an internal Docker network (`nextcloud_net`) and its ports are NOT exposed to the host for enhanced security.
- **Volumes:** Docker volumes (`nextcloud` and `db`) are used to persist user data and database records across container restarts.

## Deployment Steps

1. **Generate Credentials:**
   Run the setup script to create a `.env` file with secure, randomized database credentials.
   ```bash
   chmod +x generate-env.sh
   ./generate-env.sh
   ```

2. **Start the Stack:**
   Launch the Nextcloud and PostgreSQL containers using Docker Compose.
   ```bash
   docker-compose up -d
   ```

3. **Initialize Nextcloud:**
   Wait a minute for the containers to fully start, then access the web interface at:
   `http://<server-ip>:8080`

   On the first visit, you will be prompted to create an **admin account**.
   - Enter a secure username and password of your choice.
   - Click "Install" to finalize the setup. Nextcloud will automatically connect to the PostgreSQL database using the credentials defined in the `.env` file.
