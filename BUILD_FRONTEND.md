# Frontend Build Instructions

## Prerequisites
Node.js must be installed on your system. Download and install from: https://nodejs.org/

## Build Steps

1. **Navigate to frontend directory:**
   ```bash
   cd c:\Users\Modar Ali\Desktop\tss\booking_system\frontend
   ```

2. **Install dependencies (only needed once):**
   ```bash
   npm install
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Copy to Spring Boot static folder:**
   ```bash
   xcopy /E /I /Y dist\* ..\src\main\resources\static\
   ```

5. **Restart the backend server:**
   ```bash
   cd c:\Users\Modar Ali\Desktop\tss\booking_system
   .\mvnw.cmd spring-boot:run
   ```

## Alternative: Run Development Server

If you want hot-reload during development:

```bash
cd c:\Users\Modar Ali\Desktop\tss\booking_system\frontend
npm run dev
```

Then access the app at http://localhost:3000 (the Vite dev server will proxy API calls to the backend).

## What Changed

The following files have been updated and need to be rebuilt:
- `frontend/src/components/Navbar.jsx` - Added explicit Login/Logout buttons
- All other recent changes to pages and context

## Quick Build Command

Run this from the project root:

```bash
cd frontend && npm run build && xcopy /E /I /Y dist\* ..\src\main\resources\static\ && cd ..
```

Then restart the Spring Boot server.
