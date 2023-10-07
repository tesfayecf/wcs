### Connect to AWS EC2 Instance via SSH

To connect to your AWS EC2 instance via SSH, use the following command:

```bash
ssh -i "C:\Users\tesfa\Documents\Programming\WaterControlSystem_project\Code\MAIN\utils\ssh\credentials-0_1.pem" ubuntu@ec2-18-234-90-52.compute-1.amazonaws.com
```

Also Remote-SSH VSCode extension can be used. First you need to modify the config file located in C:\\Users\<username>\.ssh\config and add this information: 

```config
Host <hostname> # ...(amazonaws.com)
  HostName <hostname> # ...(amazonaws.com)
  IdentityFile <path to .pem file>
  User <username> # ie. ubuntu
  ForwardAgent yes
```
Then go to Remote-SSH: Connect to host and choose yours. Select Linux.

Push images to server

docker-push-ssh -i "C:\Users\tesfa\Documents\Programming\WaterControlSystem_project\Code\MAIN\utils\ssh\credentials-0_1.pem" ubuntu@ec2-54-162-217-2.compute-1.amazonaws.com wcs-app-frontend

docker save wcs-app-frontend | ssh -i "C:\Users\tesfa\Documents\Programming\WaterControlSystem_project\Code\MAIN\utils\ssh\credentials-0_1.pem" ubuntu@ec2-54-162-217-2.compute-1.amazonaws.com  docker load

docker save -o latest wcs-app-frontend:latest


### Building and Running Docker Compose on AWS

1. **Connect to AWS EC2 Instance via SSH**: Follow the previous instructions to connect to your AWS EC2 instance via SSH using your private key and hostname.

2. **Install Docker and Docker Compose**: Ensure that Docker and Docker Compose are installed on your AWS EC2 instance by running the following commands:

    ```bash
    sudo apt update
    sudo apt-get update
    sudo apt-get install ca-certificates curl gnupg
    sudo apt install docker docker-compose
    sudo apt install docker-buildx-plugin
    ```

3. **Set Build Environment Variables**: Before building your Docker Compose project, set the following environment variables to optimize the build process:

    ```bash
    export COMPOSE_DOCKER_CLI_BUILD=1
    export  
    ```

4. **Build and Run Docker Compose Services**: Now you can build and run your Docker Compose services. Navigate to the directory containing your `docker-compose.yaml` file and execute the following command:

    ```bash
    sudo COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build
    sudo docker-compose start
    ```

    You can run each separate container with this commands:

    ```bash
    sudo docker-compose -f "docker-compose.yaml" up -d --build database
    sudo docker-compose -f "docker-compose.yaml" up -d --build frontend
    sudo docker-compose -f "docker-compose.yaml" up -d --build backend_wsgi
    sudo docker-compose -f "docker-compose.yaml" up -d --build backend_asgi
    sudo docker-compose -f "docker-compose.yaml" up -d --build frontend
    ```

    This will build and start the containers for your database, frontend, and backend services in detached mode (`-d` flag).

### Backend Deployment

#### Update Requirements.txt (Backend)

In your backend deployment, make sure to update your `requirements.txt` file by:

- Removing version constraints for `asgiref` and `channels`.
- Removing the `twisted-iocpsupport` package, as it might cause issues during the build process.

### Database Deployment
# Create databases manually with pgAdmin:
# Timescale db database run command:
CREATE EXTENSION IF NOT EXISTS timescaledb;

### Frontend Deployment

[Add specific details and steps for your frontend deployment here. Include any build processes or configuration settings for your frontend application.]

By following these steps, you should be able to build and run your Docker Compose project on your AWS EC2 instance. Don't forget to customize the backend and database deployment sections with specific details related to your project's requirements.