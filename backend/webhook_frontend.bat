@echo off
echo Starting frontend deployment...

:: Change to frontend directory
cd ../frontend

echo Pulling latest changes...
git pull

echo Installing dependencies...
call npm install

echo Building frontend...
call npm run build

echo Frontend deployed successfully!
exit
