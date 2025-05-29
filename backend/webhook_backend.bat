@echo off
echo Starting backend deployment...

echo Pulling latest changes...
git pull

echo Installing dependencies...
call npm install

echo Backend deployed successfully!
exit
