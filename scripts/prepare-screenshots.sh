#!/bin/bash

# Screenshot Preparation Script
# This script prepares the directory structure and provides guidance for taking screenshots

set -e

echo "=================================="
echo "Screenshot Preparation Script"
echo "نظام قياس الأداء الوظيفي"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create directories
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p docs/screenshots
mkdir -p docs/demos
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Create placeholder files
echo -e "${BLUE}Creating placeholder files...${NC}"

# Create README for screenshots
cat > docs/screenshots/README.md << 'EOF'
# Screenshots Directory

## Files to Add

Please capture the following screenshots following the guide in `../../SCREENSHOTS_GUIDE.md`:

- [ ] `01-login-page.png` - Full login page view
- [ ] `02-login-credentials.png` - Login form with credentials
- [ ] `03-employee-dashboard.png` - Full employee dashboard
- [ ] `04-goals-section.png` - Goals section close-up
- [ ] `05-goal-detail.png` - Single goal card detail
- [ ] `06-sidebar-menu.png` - Sidebar navigation menu
- [ ] `07-user-menu.png` - User profile dropdown
- [ ] `08-evaluations-section.png` - Evaluations section

## Optimization

After capturing, optimize images using:
- Online: https://tinypng.com/
- Command line: `pngquant --quality=65-80 *.png`

Target size: 200-500 KB per image
EOF

echo -e "${GREEN}✓ Created docs/screenshots/README.md${NC}"

# Create README for demos
cat > docs/demos/README.md << 'EOF'
# Demo GIFs Directory

## Files to Add

Please record the following GIF demos following the guide in `../../SCREENSHOTS_GUIDE.md`:

- [ ] `demo-login-flow.gif` (5-10 seconds) - Login process
- [ ] `demo-dashboard-tour.gif` (15-20 seconds) - Dashboard walkthrough
- [ ] `demo-complete-workflow.gif` (30-45 seconds) - Full user journey

## Tools

### Windows
- ScreenToGif: https://www.screentogif.com/

### Mac
- LICEcap: https://www.cockos.com/licecap/

### Linux
```bash
sudo apt install peek
```

## Optimization

After recording, optimize GIFs using:
- Online: https://ezgif.com/optimize
- Target settings:
  - Frame rate: 10-15 fps
  - Colors: 128-256
  - Small GIFs: <5 MB
  - Large GIFs: <15 MB
EOF

echo -e "${GREEN}✓ Created docs/demos/README.md${NC}"

echo ""
echo -e "${BLUE}Checking system requirements...${NC}"

# Check if required tools are available
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 is installed${NC}"
        return 0
    else
        echo -e "${YELLOW}✗ $1 is not installed${NC}"
        return 1
    fi
}

# Check Node.js
check_command "node" || echo "  Install from: https://nodejs.org/"

# Check .NET
check_command "dotnet" || echo "  Install from: https://dotnet.microsoft.com/"

# Check ImageMagick (optional)
check_command "convert" || echo "  Optional - for image optimization"

echo ""
echo -e "${BLUE}Checking if services are running...${NC}"

# Check if backend is running
if curl -s http://localhost:5001 > /dev/null; then
    echo -e "${GREEN}✓ Backend is running on port 5001${NC}"
else
    echo -e "${YELLOW}✗ Backend is not running${NC}"
    echo "  Start with: cd backend/src/PerformanceSystem.API && dotnet run"
fi

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✓ Frontend is running on port 3000${NC}"
else
    echo -e "${YELLOW}✗ Frontend is not running${NC}"
    echo "  Start with: cd frontend && npm run dev"
fi

echo ""
echo "=================================="
echo "Next Steps:"
echo "=================================="
echo ""
echo "1. Start backend if not running:"
echo "   cd backend/src/PerformanceSystem.API"
echo "   dotnet run"
echo ""
echo "2. Start frontend if not running:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Follow the screenshot guide:"
echo "   Open: SCREENSHOTS_GUIDE.md"
echo ""
echo "4. Test accounts for login:"
echo "   Username: john.doe"
echo "   Password: Employee@123"
echo ""
echo "5. After capturing screenshots:"
echo "   - Place PNG files in: docs/screenshots/"
echo "   - Place GIF files in: docs/demos/"
echo "   - Optimize file sizes"
echo "   - Run: git add docs/ && git commit -m \"docs: add screenshots\""
echo ""
echo "=================================="
echo "Ready to capture! 📸"
echo "=================================="
