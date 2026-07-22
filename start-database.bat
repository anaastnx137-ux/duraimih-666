@echo off
title Draymih Law Office Server Launcher
echo ===================================================
echo   Draymih Law Office Server Launcher
echo ===================================================
echo.
echo [1/2] Starting PostgreSQL Database...
"C:\Users\HP\Desktop\draymih\postgresql\pgsql\bin\pg_ctl.exe" -D "C:\Users\HP\Desktop\draymih\postgresql\pgsql\data" -l "C:\Users\HP\Desktop\draymih\postgresql\pgsql\pg_user.log" start

echo.
echo Waiting 4 seconds for database recovery and initialization to complete...
timeout /t 4 /nobreak >nul

echo.
echo [2/2] Starting Backend Server (Express)...
cd /d "C:\Users\HP\Desktop\draymih\backend"
call npm run dev

pause
