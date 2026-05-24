@echo off
REM ========================================
REM Initialize Midwest Shipment Database
REM ========================================

echo.
echo Initializing MySQL Database for Midwest Shipment...
echo.
echo This script will:
echo   1. Create the midwest_shipment database
echo   2. Create all necessary tables
echo   3. Insert default admin user
echo.
echo Prerequisites:
echo   - MySQL Server must be running
echo   - MySQL root user should have no password (or update the script)
echo.

REM Run the schema SQL file
mysql -u root -h localhost < "%~dp0backend\config\schema.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database initialized successfully!
    echo.
    echo Default Admin Credentials:
    echo   Email:    admin@midwestshipment.com
    echo   Password: Admin@123456
    echo.
) else (
    echo.
    echo ❌ Database initialization failed!
    echo   Make sure MySQL is running and accessible.
    echo.
)

pause
