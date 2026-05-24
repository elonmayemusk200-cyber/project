@echo off
REM ========================================
REM Midwest Shipment - Integration Startup
REM ========================================

echo.
echo ✨ Starting Midwest Shipment System...
echo.

REM Step 1: Check if MySQL is running
echo Step 1: Checking MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is NOT running. Please start MySQL before continuing.
    echo    You can start MySQL with: net start MySQL80
    echo    (or adjust the service name based on your MySQL installation)
    pause
    exit /b 1
)

REM Step 2: Install backend dependencies
echo.
echo Step 2: Installing backend dependencies...
cd backend
call npm install
cd ..

REM Step 3: Install frontend dependencies
echo.
echo Step 3: Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Step 4: Initialize database
echo.
echo Step 4: Initializing database...
echo    Please manually run the schema.sql file in your MySQL client:
echo    1. Open MySQL Command Line Client or MySQL Workbench
echo    2. Run: source backend\config\schema.sql
echo    Or use: mysql -u root -h localhost ^< backend\config\schema.sql
echo.
pause

REM Step 5: Start both services concurrently
echo.
echo Step 5: Starting Frontend and Backend...
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
call npm run dev

pause
