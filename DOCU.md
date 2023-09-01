timescale self host installation with postgresql 15 installed
- git clone https://github.com/timescale/timescaledb
- cd timescale 
- git checkout 2.11.2
- bootstrap.bat
For installation on Microsoft Windows, you might need to add the pg_config and cmake file locations to your path. In the Windows Search tool, search for system environment variables. The path for pg_config should be C:\Program Files\PostgreSQL\<version>\bin. The path for cmake is within the Visual Studio directory.
- cmake --build ./build --config Release
- cmake --build ./build --config Release --target install




# DEPLOYMENT
AMAZON WEB SERVICES

Connect through ssh 
ssh -i "C:\Users\tesfa\.ssh\deploy_0.1.pem" ubuntu@ec2-34-207-232-238.compute-1.amazonaws.com

run single container

sudo docker-compose -f "docker-compose.yaml" up -d --build database
sudo docker-compose -f "docker-compose.yaml" up -d --build frontend
sudo docker-compose -f "docker-compose.yaml" up -d --build backend_wsgi
sudo docker-compose -f "docker-compose.yaml" up -d --build backend_asgi
sudo docker-compose -f "docker-compose.yaml" up -d --build frontend

## BACKEND DEPLOYMENT
- Requirements.txt
    - remove version of asgiref and channels
    - remove twisted-iocpsupport package (Building wheel for twisted-iocpsupport (pyproject.toml) did not run successfully.)

## DATABASE DEPLOYMENT

## FRONTEND DEPLOYMENT      
