# Frontend - نظام قياس الأداء الوظيفي

<div align="center">

![Platform Status](https://img.shields.io/badge/Status-Active%20Development-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Material--UI](https://img.shields.io/badge/Material--UI-5.15-blue)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.2-purple)

</div>

---

## 📸 Screenshots / لقطات الشاشة

### 🔐 Login Page / صفحة تسجيل الدخول

<div dir="rtl">

صفحة تسجيل الدخول مع تصميم حديث يستخدم ألوان العلم السعودي:
- **الأخضر السعودي** (#006C35) كلون أساسي
- **الذهبي السعودي** (#C5A572) كلون ثانوي
- دعم RTL كامل للعربية
- عرض الحسابات التجريبية للاختبار السريع

</div>

```
🎨 Features:
✅ Beautiful gradient design
✅ Show/hide password
✅ Remember me checkbox
✅ Form validation
✅ Test accounts displayed
✅ Fully responsive
```

**Test Accounts:**
- `admin` / `Admin@123` (مسؤول النظام)
- `hr.manager` / `Hr@123` (موارد بشرية)
- `it.manager` / `Manager@123` (مدير)
- `john.doe` / `Employee@123` (موظف)

---

### 🏠 Employee Dashboard / لوحة الموظف

<div dir="rtl">

لوحة تحكم الموظف تعرض:
- **إحصائيات ملونة**: إجمالي الأهداف، الأهداف المكتملة، التقييمات
- **قائمة الأهداف**: مع progress bars وحالة كل هدف
- **قائمة التقييمات**: مع الدرجات النهائية والتصنيفات

</div>

```
📊 Dashboard Components:
✅ Welcome section with user info
✅ 3 Statistics cards (colored)
✅ Goals list with progress
✅ Evaluations list with scores
✅ Quick actions buttons
✅ Real-time data from API
```

---

### 🎯 Goals Management / إدارة الأهداف

<div dir="rtl">

نظام إدارة الأهداف يتضمن:
- عرض جميع الأهداف مع التفاصيل
- شريط التقدم لكل هدف
- Chips ملونة للحالة والنوع
- زر لإضافة هدف جديد

</div>

```
🎯 Goal Features:
✅ SMART goals support
✅ Progress tracking (0-100%)
✅ Weight validation (total = 100%)
✅ Status: Draft → Approved → InProgress → Completed
✅ Types: Strategic, Operational, Development
✅ Real-time sync with backend
```

---

### 📈 Evaluations Display / عرض التقييمات

<div dir="rtl">

عرض التقييمات يشمل:
- الفترة ونوع التقييم
- الدرجة النهائية (0-5)
- التصنيف (ممتاز، فوق المتوقع، مرضي، إلخ)
- تفاصيل الدرجات الفرعية

</div>

```
📈 Evaluation Info:
✅ Period & Type
✅ Goals Score (60%)
✅ Behavior Score (30%)
✅ Initiatives Score (10%)
✅ Training Impact (±0.15/-0.20)
✅ Final Score & Rating
✅ Auto PIP creation if < 2.5
```

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+ required
node --version
# v18.x.x or higher

# npm 9+ required
npm --version
# 9.x.x or higher
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Update API URL in .env.development
VITE_API_URL=http://localhost:5001/api
```

### Running the App

#### Development Mode

```bash
# Start development server
npm run dev

# App runs on http://localhost:3000
```

#### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

#### With Backend (Full Stack)

```bash
# Terminal 1: Start Backend
cd ../backend/src/PerformanceSystem.API
dotnet run
# Backend runs on http://localhost:5001

# Terminal 2: Start Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🏗️ Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable components
│   │   ├── auth/             # Authentication components
│   │   │   ├── PrivateRoute.tsx
│   │   │   └── RoleGuard.tsx
│   │   └── layout/           # Layout components
│   │       └── MainLayout.tsx
│   ├── pages/                # Page components
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   └── employee/
│   │       └── EmployeeDashboard.tsx
│   ├── services/             # API services
│   │   ├── api.ts           # Axios instance
│   │   ├── authService.ts
│   │   ├── goalsService.ts
│   │   └── evaluationsService.ts
│   ├── store/               # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── goalsSlice.ts
│   │       ├── evaluationsSlice.ts
│   │       ├── notificationsSlice.ts
│   │       └── uiSlice.ts
│   ├── theme/              # MUI theme
│   │   └── index.ts
│   ├── i18n/               # Internationalization
│   │   └── config.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── .env.example            # Environment template
├── .env.development        # Development environment
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── README.md              # This file
```

---

## 🎨 Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.3.3 | Type safety |
| **Vite** | 5.1.4 | Build tool |
| **Material-UI** | 5.15.11 | Component library |
| **Redux Toolkit** | 2.2.1 | State management |
| **React Router** | 6.22.0 | Routing |
| **Axios** | 1.6.7 | HTTP client |
| **i18next** | 23.10.0 | Internationalization |

### Key Features

- ✅ **RTL Support**: Full right-to-left support for Arabic
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Dark Mode Ready**: Theme system supports dark mode
- ✅ **Type Safe**: Full TypeScript coverage
- ✅ **Form Validation**: React Hook Form + Yup
- ✅ **API Integration**: Complete backend integration
- ✅ **Role-Based Access**: RBAC with route guards
- ✅ **i18n**: Arabic & English translations

---

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Receive JWT token + user data
   ↓
4. Store token in localStorage
   ↓
5. Store user in Redux store
   ↓
6. Set Authorization header
   ↓
7. Redirect based on role:
   - Employee → /employee
   - Manager → /manager
   - HR → /hr
   - Admin → /admin
   - Executive → /executive
```

### Token Management

```typescript
// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📱 Available Pages

### ✅ Implemented

- [x] **Login Page** (`/login`)
- [x] **Employee Dashboard** (`/employee`)
- [x] **Protected Routes** with auth guards
- [x] **Role Guards** for access control

### 🚧 Coming Soon

- [ ] **Manager Dashboard** (`/manager`)
- [ ] **HR Dashboard** (`/hr`)
- [ ] **Admin Dashboard** (`/admin`)
- [ ] **Executive Dashboard** (`/executive`)
- [ ] **Goals CRUD** pages
- [ ] **Evaluations CRUD** pages
- [ ] **Reports & Analytics**
- [ ] **User Profile**
- [ ] **Settings**

---

## 🎯 Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  goals: {
    list: Goal[],
    currentGoal: Goal | null,
    loading: boolean,
    error: string | null,
    totalCount: number,
    pageNumber: number,
    pageSize: number
  },
  evaluations: {
    list: Evaluation[],
    currentEvaluation: Evaluation | null,
    loading: boolean,
    error: string | null
  },
  notifications: {
    list: Notification[],
    unreadCount: number,
    loading: boolean
  },
  ui: {
    sidebarOpen: boolean,
    language: 'ar' | 'en',
    theme: 'light' | 'dark'
  }
}
```

---

## 🎨 Theme & Design

### Colors

```typescript
{
  primary: {
    main: '#006C35',    // Saudi Green
    light: '#2E8B57',
    dark: '#004D26'
  },
  secondary: {
    main: '#C5A572',    // Saudi Gold
    light: '#D4BC96',
    dark: '#A68952'
  }
}
```

### Typography

```typescript
{
  fontFamily: {
    ar: "'Cairo', 'Roboto', sans-serif",
    en: "'Roboto', 'Cairo', sans-serif"
  }
}
```

### RTL Support

```typescript
// Automatic RTL based on language
const theme = createAppTheme(language === 'ar' ? 'rtl' : 'ltr');

// Stylis RTL plugin for Emotion
import rtlPlugin from 'stylis-plugin-rtl';
```

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

---

## 📦 Building for Production

```bash
# Build
npm run build

# Output in dist/
# Files are optimized and minified

# Preview production build
npm run preview
```

### Docker Build

```bash
# Build Docker image
docker build -t performance-frontend .

# Run container
docker run -p 3000:80 performance-frontend
```

---

## 🔧 Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:5001/api
VITE_SSO_CLIENT_ID=dev-client-id
VITE_SSO_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_ENV=development
```

```bash
# .env.production
VITE_API_URL=https://api.performance.gov.sa/api
VITE_SSO_CLIENT_ID=prod-client-id
VITE_SSO_REDIRECT_URI=https://performance.gov.sa/auth/callback
VITE_ENV=production
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Check backend `appsettings.json`:
```json
{
  "Cors": {
    "AllowedOrigins": ["http://localhost:3000"]
  }
}
```

### Issue 2: 401 Unauthorized

**Solution:**
Check if token is being sent:
```typescript
// services/api.ts
config.headers.Authorization = `Bearer ${token}`;
```

### Issue 3: RTL Not Working

**Solution:**
Ensure RTL cache is set up:
```typescript
import rtlPlugin from 'stylis-plugin-rtl';
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});
```

---

## 📚 Documentation

- **Frontend Plan**: `../docs/FRONTEND_PLAN.md`
- **Quick Start Guide**: `QUICKSTART.md`
- **API Documentation**: `../docs/api/API_SPECIFICATION.md`
- **Backend Setup**: `../backend/SETUP.md`

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Run lint: `npm run lint`
5. Format code: `npm run format`
6. Commit with clear message
7. Create pull request

---

## 📄 License

Proprietary - مسارات المستكشف للاتصالات وتقنية المعلومات

---

## 📞 Support

For issues and questions:
- Check `QUICKSTART.md` for quick solutions
- Review `../docs/FRONTEND_PLAN.md` for detailed planning
- See backend logs for API errors

---

<div align="center" dir="rtl">

**Built with ❤️ for Saudi Government Agencies**

**مبني بحب للجهات الحكومية السعودية**

</div>
