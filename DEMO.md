# Platform Demo Guide
## دليل تجربة النظام

<div align="center">

![Status](https://img.shields.io/badge/Status-Demo%20Ready-success)
![Phase](https://img.shields.io/badge/Phase-1%20Complete-blue)

</div>

---

## 🚀 Quick Demo (5 Minutes)

### Step 1: Start Backend API

```bash
cd backend/src/PerformanceSystem.API

# Restore dependencies (first time only)
dotnet restore

# Run migrations (first time only)
dotnet ef database update --project ../PerformanceSystem.Infrastructure

# Start API
dotnet run
```

**✅ Backend running on:** http://localhost:5001

**✅ Swagger UI:** http://localhost:5001

---

### Step 2: Start Frontend

```bash
# In a new terminal
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**✅ Frontend running on:** http://localhost:3000

---

### Step 3: Login & Explore

Open http://localhost:3000 in your browser

**Test Accounts:**

| Username | Password | Role | Arabic |
|----------|----------|------|--------|
| `admin` | `Admin@123` | Admin | مسؤول النظام |
| `hr.manager` | `Hr@123` | HR | موارد بشرية |
| `it.manager` | `Manager@123` | Manager | مدير |
| `john.doe` | `Employee@123` | Employee | موظف |
| `jane.smith` | `Employee@123` | Employee | موظف |

---

## 🎬 Demo Scenarios

### Scenario 1: Employee Login

```
1. Login as: john.doe / Employee@123
2. View dashboard with personal stats
3. See your goals list
4. Check goals progress
5. View evaluation history
6. Explore sidebar menu
```

**Expected Result:**
- ✅ See personalized dashboard
- ✅ Goals displayed with progress bars
- ✅ Evaluation scores shown
- ✅ Statistics cards with real data

---

### Scenario 2: Manager Login

```
1. Login as: it.manager / Manager@123
2. View team dashboard (Coming Soon message)
3. Logout and try another account
```

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to /manager
- ✅ Role-based access working

---

### Scenario 3: HR Login

```
1. Login as: hr.manager / Hr@123
2. View HR dashboard (Coming Soon message)
```

**Expected Result:**
- ✅ Login successful
- ✅ Redirected to /hr
- ✅ Different navigation items

---

### Scenario 4: Admin Login

```
1. Login as: admin / Admin@123
2. View admin dashboard (Coming Soon message)
```

**Expected Result:**
- ✅ Full system access
- ✅ All permissions available

---

## 📸 Screenshot Guide

### How to Take Screenshots

#### For GitHub README:

```bash
# Take screenshots of:
1. Login page
2. Employee dashboard
3. Goals list
4. Sidebar menu
5. User profile menu

# Save as:
docs/screenshots/
├── 01-login.png
├── 02-employee-dashboard.png
├── 03-goals-list.png
├── 04-sidebar.png
└── 05-profile-menu.png
```

#### For GIF Demo:

Use tools like:
- **ScreenToGif** (Windows)
- **LICEcap** (Mac/Windows)
- **Peek** (Linux)
- **Chrome DevTools** (Record option)

**Recommended GIFs:**

1. **login-flow.gif** - Login process
   ```
   - Enter username
   - Enter password
   - Click login
   - Redirect to dashboard
   Duration: 5-10 seconds
   ```

2. **dashboard-tour.gif** - Dashboard exploration
   ```
   - View statistics cards
   - Scroll through goals
   - Check evaluations
   - Open sidebar
   Duration: 15-20 seconds
   ```

3. **full-demo.gif** - Complete workflow
   ```
   - Login
   - View dashboard
   - Explore navigation
   - Logout
   Duration: 30-45 seconds
   ```

---

## 🧪 Testing Checklist

### ✅ Authentication Tests

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should fail)
- [ ] Remember me checkbox
- [ ] Show/hide password toggle
- [ ] Logout functionality
- [ ] Auto-redirect when not authenticated
- [ ] Token stored in localStorage
- [ ] Token sent in API requests

### ✅ Dashboard Tests

- [ ] Statistics cards display correctly
- [ ] Goals list loads from API
- [ ] Progress bars show correct percentage
- [ ] Status chips colored correctly
- [ ] Evaluations list displays
- [ ] Responsive on mobile
- [ ] RTL layout for Arabic
- [ ] Loading states work

### ✅ Navigation Tests

- [ ] Sidebar opens/closes
- [ ] Menu items clickable
- [ ] User avatar displayed
- [ ] Profile menu works
- [ ] Notifications bell visible
- [ ] Logo displayed
- [ ] Breadcrumbs (if any)

### ✅ API Integration Tests

- [ ] Goals fetched from backend
- [ ] Evaluations fetched from backend
- [ ] 401 handled (redirect to login)
- [ ] Error messages displayed
- [ ] Loading indicators shown
- [ ] Data refreshes correctly

### ✅ UI/UX Tests

- [ ] Colors match Saudi theme
- [ ] Arabic text displays correctly (RTL)
- [ ] Fonts render properly (Cairo)
- [ ] Buttons responsive
- [ ] Cards styled consistently
- [ ] Spacing correct
- [ ] Mobile responsive
- [ ] Accessibility (keyboard navigation)

---

## 🎥 Recording Demo Video

### Equipment Needed:
- Screen recording software
- Microphone (optional for voiceover)
- Script/talking points

### Video Structure:

```
00:00 - 00:10: Intro
    - Show login page
    - "نظام قياس الأداء الوظيفي"

00:10 - 00:30: Login
    - Enter credentials (john.doe)
    - Show test accounts list
    - Click login button

00:30 - 01:00: Dashboard Tour
    - Highlight statistics cards
    - Show goals list
    - Point out progress bars
    - Display evaluations

01:00 - 01:20: Navigation
    - Open sidebar
    - Click menu items
    - Show user menu
    - Notifications bell

01:20 - 01:40: API Integration
    - Show real data loading
    - Refresh page
    - Data persists

01:40 - 02:00: Multi-Role Demo
    - Logout
    - Login as manager
    - Show different dashboard
    - Logout

02:00 - 02:10: Outro
    - Summary of features
    - GitHub link
    - Thank you
```

---

## 📊 Demo Data

### Sample Goals (john.doe)

The backend seeds the following goals for testing:

```json
[
  {
    "title": "تحسين كفاءة الأنظمة",
    "type": "Operational",
    "weight": 30,
    "progress": 65,
    "status": "InProgress"
  },
  {
    "title": "تطوير مهارات البرمجة",
    "type": "Development",
    "weight": 20,
    "progress": 40,
    "status": "InProgress"
  }
]
```

### Sample Evaluations

```json
[
  {
    "period": "2024",
    "type": "Annual",
    "goalsScore": 4.2,
    "behaviorScore": 4.5,
    "initiativesScore": 4.0,
    "finalScore": 4.21,
    "finalRating": "AboveExpected"
  }
]
```

---

## 🐛 Troubleshooting Demo

### Problem 1: Backend Not Starting

```bash
# Check .NET SDK installed
dotnet --version
# Should be 8.0.x

# Check SQL Server running
# Windows: Check Services
# Mac/Linux: Check docker container
```

### Problem 2: Frontend Not Loading

```bash
# Check Node.js version
node --version
# Should be 18.x or higher

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem 3: API Connection Failed

```bash
# Check .env.development
cat frontend/.env.development
# VITE_API_URL=http://localhost:5001/api

# Check backend CORS
# backend/src/PerformanceSystem.API/appsettings.json
# AllowedOrigins: ["http://localhost:3000"]
```

### Problem 4: No Data Displayed

```bash
# Check database seeded
cd backend/src/PerformanceSystem.API
dotnet ef database update

# Check API accessible
curl http://localhost:5001/api/auth/me
# Should return 401 (expected without token)
```

---

## 🎬 GIF Creation Commands

### Using ScreenToGif (Windows)

```
1. Download from: https://www.screentogif.com/
2. Click "Recorder"
3. Position over browser window
4. Click Record
5. Perform demo actions
6. Click Stop
7. Edit and optimize
8. Save as .gif
```

### Using Peek (Linux)

```bash
# Install
sudo apt install peek

# Record
peek
# Select area
# Click Record
# Perform demo
# Click Stop
# Save as .gif
```

### Using LICEcap (Mac)

```
1. Download from: https://www.cockos.com/licecap/
2. Resize window to capture area
3. Click "Record..."
4. Choose filename
5. Click "Save"
6. Perform demo
7. Click "Stop"
```

---

## 📤 Publishing to GitHub

### Add Screenshots

```bash
# Create screenshots directory
mkdir -p docs/screenshots

# Add your screenshots
cp ~/Desktop/login.png docs/screenshots/01-login.png
cp ~/Desktop/dashboard.png docs/screenshots/02-dashboard.png

# Add GIFs
mkdir -p docs/demo
cp ~/Desktop/demo.gif docs/demo/platform-demo.gif
```

### Update README with Images

```markdown
## Screenshots

### Login Page
![Login Page](./docs/screenshots/01-login.png)

### Employee Dashboard
![Dashboard](./docs/screenshots/02-dashboard.png)

### Live Demo
![Platform Demo](./docs/demo/platform-demo.gif)
```

### Commit and Push

```bash
git add docs/screenshots docs/demo
git add README.md
git commit -m "docs: add screenshots and demo GIFs"
git push
```

---

## 🎯 Demo Checklist

Before presenting:

### Pre-Demo Setup
- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Database seeded with test data
- [ ] Browser tabs ready
- [ ] Screen recording software ready
- [ ] Notes/script prepared

### During Demo
- [ ] Clear browser cache first
- [ ] Show login page
- [ ] Demonstrate multiple roles
- [ ] Highlight key features
- [ ] Show responsive design
- [ ] Display RTL support
- [ ] Mention upcoming features

### Post-Demo
- [ ] Take questions
- [ ] Share GitHub link
- [ ] Provide test accounts
- [ ] Share documentation links
- [ ] Collect feedback

---

## 📝 Demo Script (Arabic)

```
مرحباً بكم في عرض نظام قياس الأداء الوظيفي

[Login Page]
هذا هو نظام متكامل لإدارة الأداء في الجهات الحكومية السعودية
النظام يدعم 5 أدوار مختلفة: موظف، مدير، موارد بشرية، مسؤول، وتنفيذي

[Enter Credentials]
سأقوم بتسجيل الدخول كموظف باستخدام الحساب التجريبي

[Dashboard]
بعد تسجيل الدخول، نرى لوحة التحكم الخاصة بالموظف
تعرض إحصائيات عن الأهداف والتقييمات

[Goals List]
هنا قائمة بالأهداف مع نسب الإنجاز
كل هدف له وزن معين ونسبة تقدم

[Evaluations]
والتقييمات تعرض الدرجات النهائية والتصنيفات

[Navigation]
القائمة الجانبية تحتوي على روابط لجميع الصفحات

[Multi-Role]
النظام يدعم أدوار متعددة بصلاحيات مختلفة

شكراً لكم
```

---

## 🌟 Key Features to Highlight

1. **Arabic-First Design**
   - Full RTL support
   - Arabic fonts
   - Saudi colors

2. **Modern UI**
   - Material Design
   - Responsive
   - Beautiful animations

3. **Secure Authentication**
   - JWT tokens
   - Role-based access
   - Protected routes

4. **Real-time Data**
   - API integration
   - Redux state management
   - Live updates

5. **Multi-Role Support**
   - Employee
   - Manager
   - HR
   - Admin
   - Executive

---

## 📞 Demo Support

If you encounter issues during demo:

1. **Check Logs**
   ```bash
   # Backend logs
   cd backend/src/PerformanceSystem.API
   cat logs/log-YYYYMMDD.txt

   # Frontend console
   Open browser DevTools → Console
   ```

2. **Restart Services**
   ```bash
   # Backend
   Ctrl+C then dotnet run

   # Frontend
   Ctrl+C then npm run dev
   ```

3. **Clear State**
   ```bash
   # Clear browser localStorage
   localStorage.clear()

   # Hard refresh
   Ctrl+Shift+R
   ```

---

<div align="center" dir="rtl">

**جاهز للعرض! 🎉**

**Ready for Demo! 🚀**

</div>
