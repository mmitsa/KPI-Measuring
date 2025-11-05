@echo off
REM Screenshot Preparation Script for Windows
REM This script prepares the directory structure and provides guidance for taking screenshots

echo ==================================
echo Screenshot Preparation Script
echo نظام قياس الأداء الوظيفي
echo ==================================
echo.

REM Create directories
echo Creating directory structure...
if not exist "docs\screenshots" mkdir docs\screenshots
if not exist "docs\demos" mkdir docs\demos
echo [✓] Directories created
echo.

REM Create README for screenshots
echo Creating placeholder files...
(
echo # Screenshots Directory
echo.
echo ## Files to Add
echo.
echo Please capture the following screenshots following the guide in `../../SCREENSHOTS_GUIDE.md`:
echo.
echo - [ ] `01-login-page.png` - Full login page view
echo - [ ] `02-login-credentials.png` - Login form with credentials
echo - [ ] `03-employee-dashboard.png` - Full employee dashboard
echo - [ ] `04-goals-section.png` - Goals section close-up
echo - [ ] `05-goal-detail.png` - Single goal card detail
echo - [ ] `06-sidebar-menu.png` - Sidebar navigation menu
echo - [ ] `07-user-menu.png` - User profile dropdown
echo - [ ] `08-evaluations-section.png` - Evaluations section
echo.
echo ## Optimization
echo.
echo After capturing, optimize images using:
echo - Online: https://tinypng.com/
echo - ScreenToGif built-in optimizer
echo.
echo Target size: 200-500 KB per image
) > docs\screenshots\README.md
echo [✓] Created docs\screenshots\README.md

REM Create README for demos
(
echo # Demo GIFs Directory
echo.
echo ## Files to Add
echo.
echo Please record the following GIF demos following the guide in `../../SCREENSHOTS_GUIDE.md`:
echo.
echo - [ ] `demo-login-flow.gif` ^(5-10 seconds^) - Login process
echo - [ ] `demo-dashboard-tour.gif` ^(15-20 seconds^) - Dashboard walkthrough
echo - [ ] `demo-complete-workflow.gif` ^(30-45 seconds^) - Full user journey
echo.
echo ## Recommended Tool
echo.
echo **ScreenToGif** ^(Free, Windows^)
echo - Download: https://www.screentogif.com/
echo - Easy to use with built-in editor
echo - Can optimize GIFs before saving
echo.
echo ## Settings
echo.
echo - Frame rate: 10-15 fps
echo - Colors: 128-256
echo - Target size: ^<15 MB
) > docs\demos\README.md
echo [✓] Created docs\demos\README.md
echo.

echo Checking system requirements...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] Node.js is installed
) else (
    echo [✗] Node.js is not installed
    echo     Install from: https://nodejs.org/
)

REM Check .NET
where dotnet >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [✓] .NET SDK is installed
) else (
    echo [✗] .NET SDK is not installed
    echo     Install from: https://dotnet.microsoft.com/
)

echo.
echo ==================================
echo Next Steps:
echo ==================================
echo.
echo 1. Start backend if not running:
echo    cd backend\src\PerformanceSystem.API
echo    dotnet run
echo.
echo 2. Start frontend if not running:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Follow the screenshot guide:
echo    Open: SCREENSHOTS_GUIDE.md
echo.
echo 4. Recommended tool for Windows:
echo    Download ScreenToGif: https://www.screentogif.com/
echo.
echo 5. Test account for login:
echo    Username: john.doe
echo    Password: Employee@123
echo.
echo 6. After capturing screenshots:
echo    - Place PNG files in: docs\screenshots\
echo    - Place GIF files in: docs\demos\
echo    - Optimize file sizes
echo    - Run: git add docs\ ^&^& git commit -m "docs: add screenshots"
echo.
echo ==================================
echo Ready to capture! 📸
echo ==================================
echo.
pause
