@echo off
echo Starting Phoolse Fayda App...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
