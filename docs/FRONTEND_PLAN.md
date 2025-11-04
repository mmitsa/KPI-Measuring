# Frontend Development Plan
## نظام قياس الأداء الوظيفي - Government Performance Management System

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Phases](#development-phases)
5. [User Roles & Features](#user-roles--features)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [Authentication & Authorization](#authentication--authorization)
9. [UI/UX Design Guidelines](#uiux-design-guidelines)
10. [Testing Strategy](#testing-strategy)
11. [Performance Optimization](#performance-optimization)
12. [Deployment & DevOps](#deployment--devops)
13. [Timeline & Milestones](#timeline--milestones)

---

## 🎯 Overview

### Objectives
- Build a production-ready, Arabic-first web application
- Support 5 user roles with distinct workflows
- Integrate seamlessly with ASP.NET Core backend API
- Ensure compliance with Saudi government UX standards
- Achieve high performance (LCP < 2.5s, FID < 100ms)
- Support both Arabic (primary) and English languages

### Success Criteria
- ✅ All 5 user roles can complete their workflows
- ✅ Mobile-responsive design (tablets & desktops)
- ✅ RTL (Right-to-Left) support for Arabic
- ✅ Accessibility compliance (WCAG 2.1 Level AA)
- ✅ Performance score > 90 (Lighthouse)
- ✅ Zero critical security vulnerabilities

---

## 🛠 Technology Stack

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.x | UI framework |
| **TypeScript** | 5.3.x | Type safety |
| **Vite** | 5.0.x | Build tool & dev server |
| **Material-UI (MUI)** | 5.15.x | Component library |
| **Redux Toolkit** | 2.2.x | State management |
| **React Router** | 6.22.x | Routing |
| **Axios** | 1.6.x | HTTP client |
| **React Hook Form** | 7.50.x | Form handling |
| **Yup** | 1.3.x | Validation |
| **i18next** | 23.x | Internationalization |
| **Chart.js** | 4.4.x | Data visualization |
| **date-fns** | 3.x | Date utilities |

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **Storybook** - Component documentation

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── locales/                    # Translation files
│   │   ├── ar/
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── goals.json
│   │   │   ├── evaluations.json
│   │   │   └── reports.json
│   │   └── en/
│   │       └── ...
│   └── assets/
│       ├── images/
│       └── icons/
├── src/
│   ├── components/                 # Reusable components
│   │   ├── common/                 # Common UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── DataTable/
│   │   │   ├── Dialog/
│   │   │   ├── Form/
│   │   │   ├── Layout/
│   │   │   └── Loading/
│   │   ├── auth/                   # Authentication components
│   │   │   ├── LoginForm/
│   │   │   ├── PrivateRoute/
│   │   │   └── RoleGuard/
│   │   ├── goals/                  # Goal management components
│   │   │   ├── GoalList/
│   │   │   ├── GoalForm/
│   │   │   ├── GoalCard/
│   │   │   ├── GoalProgress/
│   │   │   └── GoalApproval/
│   │   ├── evaluations/            # Evaluation components
│   │   │   ├── EvaluationList/
│   │   │   ├── EvaluationForm/
│   │   │   ├── ScoreInput/
│   │   │   ├── RatingDisplay/
│   │   │   └── EvaluationSummary/
│   │   ├── employees/              # Employee management
│   │   │   ├── EmployeeList/
│   │   │   ├── EmployeeProfile/
│   │   │   └── EmployeeCard/
│   │   ├── reports/                # Reports & analytics
│   │   │   ├── DashboardCharts/
│   │   │   ├── PerformanceReport/
│   │   │   └── ExportButton/
│   │   └── notifications/          # Notification components
│   │       ├── NotificationBell/
│   │       └── NotificationList/
│   ├── pages/                      # Page components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── SSOCallbackPage.tsx
│   │   ├── employee/               # Employee role pages
│   │   │   ├── EmployeeDashboard.tsx
│   │   │   ├── MyGoals.tsx
│   │   │   ├── MyEvaluations.tsx
│   │   │   └── MyProfile.tsx
│   │   ├── manager/                # Manager role pages
│   │   │   ├── ManagerDashboard.tsx
│   │   │   ├── TeamGoals.tsx
│   │   │   ├── TeamEvaluations.tsx
│   │   │   ├── ApproveGoals.tsx
│   │   │   └── TeamPerformance.tsx
│   │   ├── hr/                     # HR role pages
│   │   │   ├── HRDashboard.tsx
│   │   │   ├── AllEmployees.tsx
│   │   │   ├── AllEvaluations.tsx
│   │   │   ├── PIPs.tsx
│   │   │   └── CompanyReports.tsx
│   │   ├── admin/                  # Admin role pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── RolesPermissions.tsx
│   │   │   ├── Departments.tsx
│   │   │   ├── SystemSettings.tsx
│   │   │   └── AuditLogs.tsx
│   │   └── executive/              # Executive role pages
│   │       ├── ExecutiveDashboard.tsx
│   │       ├── CompanyMetrics.tsx
│   │       └── StrategicReports.tsx
│   ├── store/                      # Redux store
│   │   ├── index.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── goalsSlice.ts
│   │       ├── evaluationsSlice.ts
│   │       ├── employeesSlice.ts
│   │       ├── notificationsSlice.ts
│   │       └── uiSlice.ts
│   ├── services/                   # API services
│   │   ├── api.ts                  # Axios instance
│   │   ├── authService.ts
│   │   ├── goalsService.ts
│   │   ├── evaluationsService.ts
│   │   ├── employeesService.ts
│   │   └── reportsService.ts
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useNotifications.ts
│   ├── utils/                      # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── permissions.ts
│   ├── types/                      # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── goals.types.ts
│   │   ├── evaluations.types.ts
│   │   ├── employees.types.ts
│   │   └── common.types.ts
│   ├── theme/                      # MUI theme configuration
│   │   ├── index.ts
│   │   ├── palette.ts
│   │   ├── typography.ts
│   │   └── components.ts
│   ├── i18n/                       # i18n configuration
│   │   └── config.ts
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .env.development
├── .env.production
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## 🚀 Development Phases

### **Phase 1: Infrastructure Setup** (Week 1)
**Duration:** 5 days
**Team:** 1-2 Frontend Developers

#### Tasks:
1. ✅ Initialize Vite project with TypeScript
2. ✅ Install and configure dependencies
3. ⬜ Set up Redux Toolkit store structure
4. ⬜ Configure React Router with role-based routing
5. ⬜ Set up MUI theme with RTL support
6. ⬜ Configure i18next for Arabic/English
7. ⬜ Create Axios instance with interceptors
8. ⬜ Set up ESLint, Prettier, and pre-commit hooks
9. ⬜ Create base layout components
10. ⬜ Set up environment variables

#### Deliverables:
- ✅ Working dev server with HMR
- ⬜ Configured Redux store
- ⬜ RTL-enabled MUI theme
- ⬜ API service layer with auth interceptors
- ⬜ Base routing structure

---

### **Phase 2: Authentication & Authorization** (Week 1-2)
**Duration:** 3 days
**Team:** 1 Frontend Developer

#### Tasks:
1. ⬜ Create login page with form validation
2. ⬜ Implement JWT token storage (localStorage/sessionStorage)
3. ⬜ Create PrivateRoute component
4. ⬜ Create RoleGuard component for role-based access
5. ⬜ Implement auto token refresh logic
6. ⬜ Create logout functionality
7. ⬜ Add "Remember Me" functionality
8. ⬜ Create SSO callback handler (Masar integration)
9. ⬜ Add auth state to Redux
10. ⬜ Create useAuth hook

#### Deliverables:
- ⬜ Fully functional login/logout
- ⬜ Protected routes with role checks
- ⬜ Persistent authentication
- ⬜ SSO integration ready

#### Key Components:
```typescript
// LoginPage.tsx
// PrivateRoute.tsx
// RoleGuard.tsx
// store/slices/authSlice.ts
// services/authService.ts
```

---

### **Phase 3: Common Components Library** (Week 2)
**Duration:** 5 days
**Team:** 2 Frontend Developers

#### Tasks:
1. ⬜ Create reusable Button component
2. ⬜ Create Card component with variants
3. ⬜ Create DataTable with pagination, sorting, filtering
4. ⬜ Create Dialog/Modal component
5. ⬜ Create Form components (Input, Select, DatePicker, etc.)
6. ⬜ Create Loading skeletons and spinners
7. ⬜ Create Breadcrumbs component
8. ⬜ Create Alert/Snackbar component
9. ⬜ Create Avatar component
10. ⬜ Create Status Badge component
11. ⬜ Write Storybook stories for all components
12. ⬜ Write unit tests for all components

#### Deliverables:
- ⬜ 15+ reusable components
- ⬜ Storybook documentation
- ⬜ 80%+ test coverage

---

### **Phase 4: Employee Dashboard** (Week 3)
**Duration:** 5 days
**Team:** 2 Frontend Developers

#### Employee Features:
1. ⬜ Dashboard with KPI overview
   - Current goals with progress
   - Latest evaluation score
   - Upcoming deadlines
   - Notifications
2. ⬜ My Goals page
   - View all goals
   - Create new goal
   - Update goal progress
   - View goal details
3. ⬜ My Evaluations page
   - View evaluation history
   - View current evaluation
   - Add self-evaluation notes
4. ⬜ My Profile page
   - Personal information
   - Department & position
   - Manager information
   - Change password

#### Components to Build:
```typescript
// pages/employee/EmployeeDashboard.tsx
// pages/employee/MyGoals.tsx
// pages/employee/MyEvaluations.tsx
// pages/employee/MyProfile.tsx
// components/goals/GoalList.tsx
// components/goals/GoalForm.tsx
// components/goals/GoalProgress.tsx
// components/evaluations/EvaluationList.tsx
```

#### API Integration:
- GET /api/goals (filtered by employee)
- POST /api/goals
- PUT /api/goals/{id}/progress
- GET /api/evaluations (filtered by employee)

---

### **Phase 5: Manager Dashboard** (Week 4)
**Duration:** 5 days
**Team:** 2 Frontend Developers

#### Manager Features:
1. ⬜ Manager Dashboard
   - Team overview (# of subordinates)
   - Pending goal approvals
   - Evaluation progress
   - Team performance chart
2. ⬜ Team Goals page
   - View all team goals
   - Approve/reject goals
   - Monitor goal progress
   - Send reminders
3. ⬜ Team Evaluations page
   - Create evaluations
   - Update evaluation scores
   - Finalize evaluations
   - View evaluation history
4. ⬜ Team Performance page
   - Performance distribution chart
   - Individual performance cards
   - Export team report

#### Components to Build:
```typescript
// pages/manager/ManagerDashboard.tsx
// pages/manager/TeamGoals.tsx
// pages/manager/TeamEvaluations.tsx
// pages/manager/TeamPerformance.tsx
// components/goals/GoalApproval.tsx
// components/evaluations/EvaluationForm.tsx
// components/evaluations/ScoreInput.tsx
// components/evaluations/EvaluationSummary.tsx
// components/reports/PerformanceChart.tsx
```

#### API Integration:
- GET /api/goals (team goals)
- POST /api/goals/{id}/approve
- POST /api/evaluations
- PUT /api/evaluations/{id}/scores
- POST /api/evaluations/{id}/finalize

---

### **Phase 6: HR Dashboard** (Week 5)
**Duration:** 5 days
**Team:** 2 Frontend Developers

#### HR Features:
1. ⬜ HR Dashboard
   - Company-wide statistics
   - Evaluation progress by department
   - PIPs overview
   - Training compliance
2. ⬜ All Employees page
   - Employee directory
   - Search & filter
   - View employee details
   - Export employee list
3. ⬜ All Evaluations page
   - View all evaluations
   - Approve evaluations
   - Generate reports
4. ⬜ PIPs Management page
   - View all PIPs
   - Create/update PIPs
   - Monitor PIP progress
   - Close PIPs
5. ⬜ Company Reports page
   - Performance distribution
   - Department comparison
   - Training impact analysis
   - Export to Excel/PDF

#### Components to Build:
```typescript
// pages/hr/HRDashboard.tsx
// pages/hr/AllEmployees.tsx
// pages/hr/AllEvaluations.tsx
// pages/hr/PIPs.tsx
// pages/hr/CompanyReports.tsx
// components/employees/EmployeeList.tsx
// components/employees/EmployeeProfile.tsx
// components/reports/DepartmentChart.tsx
// components/reports/ExportButton.tsx
```

---

### **Phase 7: Admin Dashboard** (Week 6)
**Duration:** 5 days
**Team:** 2 Frontend Developers

#### Admin Features:
1. ⬜ Admin Dashboard
   - System health
   - User activity
   - Recent audit logs
2. ⬜ User Management
   - Create/edit/delete users
   - Assign roles
   - Reset passwords
   - Activate/deactivate users
3. ⬜ Roles & Permissions
   - Manage roles
   - Assign permissions
   - View permission matrix
4. ⬜ Departments Management
   - Create/edit departments
   - Manage positions
   - Set department heads
5. ⬜ System Settings
   - Evaluation periods
   - Performance thresholds
   - Email templates
   - System configuration
6. ⬜ Audit Logs
   - View all system activity
   - Filter by user/action
   - Export logs

#### Components to Build:
```typescript
// pages/admin/AdminDashboard.tsx
// pages/admin/UserManagement.tsx
// pages/admin/RolesPermissions.tsx
// pages/admin/Departments.tsx
// pages/admin/SystemSettings.tsx
// pages/admin/AuditLogs.tsx
```

---

### **Phase 8: Executive Dashboard** (Week 7)
**Duration:** 3 days
**Team:** 1 Frontend Developer

#### Executive Features:
1. ⬜ Executive Dashboard
   - High-level KPIs
   - Company performance trend
   - Department rankings
   - Strategic metrics
2. ⬜ Company Metrics page
   - Performance analytics
   - Goal completion rates
   - Training ROI
3. ⬜ Strategic Reports page
   - Quarterly reports
   - Annual performance
   - Export executive summary

#### Components to Build:
```typescript
// pages/executive/ExecutiveDashboard.tsx
// pages/executive/CompanyMetrics.tsx
// pages/executive/StrategicReports.tsx
// components/reports/ExecutiveChart.tsx
```

---

### **Phase 9: Notifications & Real-time Features** (Week 7)
**Duration:** 2 days
**Team:** 1 Frontend Developer

#### Features:
1. ⬜ Notification bell with badge count
2. ⬜ Notification dropdown list
3. ⬜ Mark as read/unread
4. ⬜ Notification preferences
5. ⬜ Toast notifications for actions
6. ⬜ WebSocket connection (optional for real-time updates)

#### Components:
```typescript
// components/notifications/NotificationBell.tsx
// components/notifications/NotificationList.tsx
// store/slices/notificationsSlice.ts
```

---

### **Phase 10: Testing & Quality Assurance** (Week 8)
**Duration:** 5 days
**Team:** 2 Frontend Developers + 1 QA Engineer

#### Tasks:
1. ⬜ Write unit tests for all components (target: 80% coverage)
2. ⬜ Write integration tests for API services
3. ⬜ Write E2E tests for critical user flows:
   - Login → Create Goal → Approve Goal
   - Login → Create Evaluation → Finalize
   - Login → View Reports → Export
4. ⬜ Perform accessibility audit
5. ⬜ Perform cross-browser testing (Chrome, Firefox, Safari, Edge)
6. ⬜ Perform mobile responsiveness testing
7. ⬜ Load testing with large datasets
8. ⬜ Security audit (XSS, CSRF)
9. ⬜ Performance optimization (Lighthouse audit)
10. ⬜ Bug fixes and refinements

#### Testing Tools:
- **Vitest** for unit tests
- **React Testing Library** for component tests
- **Playwright** for E2E tests
- **Axe** for accessibility testing

---

### **Phase 11: Documentation & Deployment** (Week 8)
**Duration:** 3 days
**Team:** 1 Frontend Developer + 1 DevOps Engineer

#### Tasks:
1. ⬜ Write comprehensive README
2. ⬜ Document component usage in Storybook
3. ⬜ Create deployment guide
4. ⬜ Set up CI/CD pipeline (GitHub Actions)
5. ⬜ Configure production build
6. ⬜ Set up Nginx configuration
7. ⬜ Configure SSL/TLS
8. ⬜ Set up monitoring (Sentry for errors)
9. ⬜ Deploy to staging environment
10. ⬜ Perform UAT (User Acceptance Testing)
11. ⬜ Deploy to production

---

## 👥 User Roles & Features

### 1. **Employee (موظف)**
**Primary Goal:** Manage personal goals and view evaluations

| Feature | Description | Priority |
|---------|-------------|----------|
| View Dashboard | See personal KPIs, goals, and evaluations | P0 |
| Create Goals | Set SMART goals for evaluation period | P0 |
| Update Goal Progress | Track progress percentage | P0 |
| View Evaluations | See evaluation history and scores | P0 |
| Add Self Notes | Add comments to evaluations | P1 |
| View Notifications | Get updates on approvals and deadlines | P1 |
| Update Profile | Change personal information | P2 |
| Change Password | Update account password | P2 |

### 2. **Manager (مدير)**
**Primary Goal:** Manage team performance and conduct evaluations

| Feature | Description | Priority |
|---------|-------------|----------|
| View Team Dashboard | See team performance overview | P0 |
| Approve Goals | Approve or reject employee goals | P0 |
| Create Evaluations | Start evaluation for employees | P0 |
| Score Evaluations | Enter goal, behavior, initiative scores | P0 |
| Finalize Evaluations | Calculate final score and create PIP if needed | P0 |
| View Team Performance | See charts and reports | P1 |
| Send Reminders | Remind employees about pending goals | P1 |
| Export Team Reports | Download team performance data | P2 |

### 3. **HR (موارد بشرية)**
**Primary Goal:** Oversee company-wide performance management

| Feature | Description | Priority |
|---------|-------------|----------|
| View HR Dashboard | Company-wide performance metrics | P0 |
| View All Employees | Employee directory with search | P0 |
| View All Evaluations | Monitor all evaluations | P0 |
| Approve Evaluations | Final approval of evaluations | P0 |
| Manage PIPs | Create, monitor, close PIPs | P0 |
| Generate Reports | Department and company reports | P1 |
| Export Data | Excel/PDF exports | P1 |
| Training Analysis | View training impact on performance | P2 |

### 4. **Admin (مسؤول النظام)**
**Primary Goal:** System administration and configuration

| Feature | Description | Priority |
|---------|-------------|----------|
| User Management | Create, edit, delete users | P0 |
| Role Assignment | Assign roles to users | P0 |
| Manage Departments | Create/edit departments and positions | P0 |
| System Settings | Configure evaluation periods, thresholds | P0 |
| View Audit Logs | Monitor system activity | P1 |
| Manage Permissions | Configure role permissions | P1 |
| Email Templates | Customize notification emails | P2 |

### 5. **Executive (تنفيذي)**
**Primary Goal:** Strategic oversight and decision-making

| Feature | Description | Priority |
|---------|-------------|----------|
| Executive Dashboard | High-level KPIs and trends | P0 |
| Company Metrics | Performance analytics | P0 |
| Strategic Reports | Quarterly and annual reports | P0 |
| Department Comparison | Benchmark departments | P1 |
| Export Executive Summary | PDF reports for board meetings | P1 |

---

## 🏗 Component Architecture

### Component Hierarchy

```
App
├── AuthProvider
├── ThemeProvider
├── i18nProvider
└── Router
    ├── PublicRoutes
    │   └── LoginPage
    └── PrivateRoutes
        ├── Layout
        │   ├── Header
        │   │   ├── Logo
        │   │   ├── Navigation
        │   │   ├── LanguageSwitcher
        │   │   ├── NotificationBell
        │   │   └── UserMenu
        │   ├── Sidebar
        │   │   └── NavigationMenu
        │   ├── Content
        │   │   └── [Role-specific pages]
        │   └── Footer
        └── RoleGuard
            ├── EmployeeRoutes
            ├── ManagerRoutes
            ├── HRRoutes
            ├── AdminRoutes
            └── ExecutiveRoutes
```

### Design Patterns

1. **Container/Presenter Pattern**
   - Container components handle logic and state
   - Presenter components handle UI rendering

2. **Compound Components**
   - DataTable with TableHeader, TableBody, TableRow, etc.

3. **Render Props**
   - For flexible component composition

4. **Custom Hooks**
   - Reusable logic extraction

---

## 🗄 State Management

### Redux Store Structure

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
    filters: GoalFilters,
    pagination: Pagination,
    loading: boolean,
    error: string | null
  },
  evaluations: {
    list: Evaluation[],
    currentEvaluation: Evaluation | null,
    filters: EvaluationFilters,
    pagination: Pagination,
    loading: boolean,
    error: string | null
  },
  employees: {
    list: Employee[],
    currentEmployee: Employee | null,
    pagination: Pagination,
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

### When to Use Redux vs Local State

**Use Redux for:**
- User authentication state
- Data shared across multiple components
- Data that needs to persist across route changes
- Complex state logic

**Use Local State for:**
- Form input values
- UI state (modals, dropdowns)
- Component-specific state
- Temporary data

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User enters credentials
2. POST /api/auth/login
3. Receive JWT token + user data
4. Store token in localStorage
5. Store user data in Redux
6. Set Authorization header for all API calls
7. Redirect to role-specific dashboard
```

### Token Management

```typescript
// Auto-refresh token before expiration
// Interceptor for 401 responses
// Clear auth state on logout
// Handle token expiration gracefully
```

### Role-Based Access Control (RBAC)

```typescript
// Permission checks
const hasPermission = (permission: string) => {
  return user.permissions.includes(permission);
};

// Route guards
<RoleGuard allowedRoles={['Manager', 'HR']}>
  <TeamEvaluations />
</RoleGuard>

// Component-level guards
{hasPermission('GOALS_APPROVE') && (
  <ApproveButton />
)}
```

---

## 🎨 UI/UX Design Guidelines

### Arabic-First Design
- **RTL Layout**: All components support RTL
- **Arabic Typography**: Use "Cairo" or "Tajawal" fonts
- **Number Formatting**: Arabic numerals (١٢٣) with fallback to Western (123)
- **Date Formatting**: Hijri calendar support with Gregorian fallback

### Color Scheme (Saudi Government Theme)

```typescript
{
  primary: {
    main: '#006C35', // Saudi green
    light: '#2E8B57',
    dark: '#004D26'
  },
  secondary: {
    main: '#C5A572', // Saudi gold
    light: '#D4BC96',
    dark: '#A68952'
  },
  error: {
    main: '#D32F2F'
  },
  warning: {
    main: '#F57C00'
  },
  success: {
    main: '#388E3C'
  },
  info: {
    main: '#1976D2'
  }
}
```

### Typography

```typescript
{
  fontFamily: {
    primary: "'Cairo', 'Roboto', sans-serif",
    secondary: "'Tajawal', 'Open Sans', sans-serif"
  },
  fontSize: {
    h1: '2.5rem',  // 40px
    h2: '2rem',    // 32px
    h3: '1.75rem', // 28px
    h4: '1.5rem',  // 24px
    h5: '1.25rem', // 20px
    h6: '1rem',    // 16px
    body1: '1rem', // 16px
    body2: '0.875rem' // 14px
  }
}
```

### Spacing System
- Use 8px grid system
- Consistent spacing: 8, 16, 24, 32, 40, 48, 64px

### Accessibility
- All interactive elements have ARIA labels
- Keyboard navigation support
- Screen reader support
- Color contrast ratio ≥ 4.5:1
- Focus indicators visible
- Form validation errors clearly communicated

---

## 🧪 Testing Strategy

### Unit Tests (Target: 80% coverage)
```bash
# Test all utility functions
# Test Redux reducers and actions
# Test custom hooks
# Test component logic

npm run test:unit
```

### Component Tests
```bash
# Test component rendering
# Test user interactions
# Test prop variations
# Test accessibility

npm run test:component
```

### Integration Tests
```bash
# Test API service integration
# Test Redux thunks
# Test form submissions
# Test authentication flow

npm run test:integration
```

### E2E Tests
```bash
# Test critical user workflows
# Test cross-browser compatibility
# Test mobile responsiveness

npm run test:e2e
```

### Testing Checklist
- [ ] All components have unit tests
- [ ] All API services have integration tests
- [ ] All user flows have E2E tests
- [ ] Accessibility audit passed
- [ ] Performance audit passed (Lighthouse score > 90)
- [ ] Security audit passed (no XSS, CSRF vulnerabilities)
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

---

## ⚡ Performance Optimization

### Code Splitting
```typescript
// Lazy load route components
const EmployeeDashboard = lazy(() => import('./pages/employee/EmployeeDashboard'));

// Lazy load heavy components
const ReportChart = lazy(() => import('./components/reports/ReportChart'));
```

### Image Optimization
- Use WebP format with fallbacks
- Lazy load images
- Use responsive images with srcset
- Compress images before upload

### Bundle Optimization
- Tree-shaking unused code
- Code splitting by route
- Minimize vendor bundle size
- Use dynamic imports

### Caching Strategy
- Cache API responses (React Query or RTK Query)
- Cache static assets with service workers
- Use HTTP caching headers

### Performance Targets
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.8s

---

## 🚢 Deployment & DevOps

### Build Process

```bash
# Development build
npm run dev

# Production build
npm run build
# Output: dist/

# Preview production build
npm run preview
```

### Environment Variables

```bash
# .env.development
VITE_API_URL=http://localhost:5001/api
VITE_SSO_CLIENT_ID=dev-client-id
VITE_SSO_REDIRECT_URI=http://localhost:3000/auth/callback

# .env.production
VITE_API_URL=https://api.performance.gov.sa/api
VITE_SSO_CLIENT_ID=prod-client-id
VITE_SSO_REDIRECT_URI=https://performance.gov.sa/auth/callback
```

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - name: Deploy to staging
        if: github.ref == 'refs/heads/main'
        run: |
          # Deploy to staging server
      - name: Deploy to production
        if: github.ref == 'refs/heads/production'
        run: |
          # Deploy to production server
```

---

## 📅 Timeline & Milestones

### 8-Week Development Plan

| Week | Phase | Deliverables | Team Size |
|------|-------|--------------|-----------|
| **Week 1** | Infrastructure + Auth | Redux setup, Routing, Login, Theme | 2 devs |
| **Week 2** | Common Components | 15+ reusable components, Storybook | 2 devs |
| **Week 3** | Employee Dashboard | 4 pages, Goal management | 2 devs |
| **Week 4** | Manager Dashboard | 4 pages, Evaluation workflow | 2 devs |
| **Week 5** | HR Dashboard | 5 pages, Company reports | 2 devs |
| **Week 6** | Admin Dashboard | 6 pages, System management | 2 devs |
| **Week 7** | Executive + Notifications | 3 pages, Real-time features | 1 dev |
| **Week 8** | Testing + Deployment | Tests, QA, Production deployment | 3 people |

### Key Milestones

- ✅ **M1:** Project setup complete (Week 1)
- ⬜ **M2:** Authentication working (Week 1)
- ⬜ **M3:** Component library ready (Week 2)
- ⬜ **M4:** Employee portal complete (Week 3)
- ⬜ **M5:** Manager portal complete (Week 4)
- ⬜ **M6:** HR portal complete (Week 5)
- ⬜ **M7:** Admin portal complete (Week 6)
- ⬜ **M8:** All features complete (Week 7)
- ⬜ **M9:** Testing complete (Week 8)
- ⬜ **M10:** Production deployment (Week 8)

---

## 📊 Success Metrics

### Technical Metrics
- **Code Coverage:** ≥ 80%
- **Lighthouse Score:** ≥ 90
- **Bundle Size:** < 500KB (gzipped)
- **Load Time:** < 3 seconds
- **Zero** critical security vulnerabilities

### Business Metrics
- **User Adoption:** 80% of employees actively using the system
- **Goal Completion:** 90% of employees complete goal setting
- **Evaluation Completion:** 95% of evaluations completed on time
- **User Satisfaction:** ≥ 4.0/5.0 rating

### Quality Metrics
- **Bug Rate:** < 5 bugs per 1000 lines of code
- **Accessibility Score:** WCAG 2.1 Level AA compliance
- **Browser Support:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Support:** iOS Safari, Chrome Android

---

## 🎯 Next Steps

### Immediate Actions (This Week)
1. ✅ Review and approve this plan
2. ⬜ Assemble frontend team (2-3 developers)
3. ⬜ Set up development environment for all team members
4. ⬜ Start Phase 1: Infrastructure Setup
5. ⬜ Create Figma/Adobe XD designs for key pages
6. ⬜ Set up project management board (Jira/Trello)

### Week 1 Goals
- ⬜ Complete Redux store setup
- ⬜ Complete routing configuration
- ⬜ Complete MUI theme with RTL
- ⬜ Complete i18n setup with Arabic/English translations
- ⬜ Complete authentication implementation
- ⬜ Complete API service layer

### Questions to Resolve
1. Do we have UI/UX designs ready? If not, should we create them first?
2. What is the target deployment environment (cloud provider)?
3. Do we need mobile app support (React Native) in the future?
4. What analytics tool should we integrate (Google Analytics, Matomo)?
5. What is the monitoring and alerting strategy (Sentry, LogRocket)?

---

## 📞 Support & Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)

### Team Communication
- Daily standups at 9:00 AM
- Weekly sprint planning on Mondays
- Code reviews required for all PRs
- Slack channel: #frontend-dev

---

**Document Version:** 1.0
**Last Updated:** 2025-11-04
**Author:** Development Team
**Status:** Ready for Implementation ✅
