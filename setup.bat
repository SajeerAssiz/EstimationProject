@echo off
echo ============================================
echo D365 F&O ERP Estimation Tool - Setup
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo Node.js found:
node --version
echo.

:: Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup complete!
echo ============================================
echo.
echo To start the application, run:
echo   npm run dev
echo.
echo Then open http://localhost:5173 in your browser
echo.
echo For Azure AD setup, see SETUP_WINDOWS.md
echo.
pause
