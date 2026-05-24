# Midwest Shipment - Integration Setup Guide

## Quick Start (Windows)

### Step 1: Start MySQL Server
First, ensure MySQL is running on your machine:

```bash
# Option 1: If MySQL is installed as a Windows Service
net start MySQL80

# Option 2: If you need to find the service name
sc query | find "MySQL"

# Option 3: Start MySQL manually from installation directory
# Typically: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe
```

### Step 2: Initialize Database
Run the database setup script:

```bash
cd c:\Users\WIZZY\midwest-shipment
INIT_DATABASE.bat
```

Or manually run:
```bash
mysql -u root -h localhost < backend\config\schema.sql
```

### Step 3: Install Dependencies
Navigate to project and install packages:

```bash
cd c:\Users\WIZZY\midwest-shipment

# Install all dependencies
npm install

# Or install individually:
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### Step 4: Start the Development Environment
Option A - Start all together:
```bash
npm run dev
```

Option B - Start separately:
```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start frontend  
npm run frontend
```

### Step 5: Verify Integration
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Backend Health Check: http://localhost:5000/api/health

## Default Admin Credentials
After database initialization:
- **Email**: admin@midwestshipment.com
- **Password**: Admin@123456

## Troubleshooting

### MySQL Connection Failed
- Ensure MySQL Server is running
- Check if port 3306 is not blocked
- Verify credentials in `backend/.env` match your setup

### Port Already in Use
- Port 3000 (Frontend): `netstat -ano | findstr :3000`
- Port 5000 (Backend): `netstat -ano | findstr :5000`
- Stop conflicting processes: `taskkill /PID <PID> /F`

### Dependencies Installation Failed
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and package-lock.json
- Run `npm install` again

## Environment Files

### Backend Configuration (.env)
Located at: `backend/.env`
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=midwest_shipment
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Frontend Configuration
Frontend will automatically connect to `http://localhost:5000` for API calls.

## Database Schema Overview
The database includes tables for:
- **Admins**: System administrators
- **Customers**: Registered users
- **Shipments**: Shipping records with tracking
- **Tracking Events**: Real-time tracking updates
- **Support Tickets**: Customer support management
- **Notifications**: Customer alerts
- **Contact Messages**: Website contact form submissions

See `backend/config/schema.sql` for full schema details.
