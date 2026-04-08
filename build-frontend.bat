@echo off
echo ========================================
echo Building Frontend and Deploying to Backend
echo ========================================
echo.

cd frontend

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo.

echo Step 2: Building frontend...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo Step 3: Copying to Spring Boot static folder...
xcopy /E /I /Y dist\* ..\src\main\resources\static\
if errorlevel 1 (
    echo ERROR: Copy failed!
    pause
    exit /b 1
)
echo.

cd ..

echo ========================================
echo Frontend built and deployed successfully!
echo ========================================
echo.
echo Now restart the backend server:
echo   .\mvnw.cmd spring-boot:run
echo.
pause
