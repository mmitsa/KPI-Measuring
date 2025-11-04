# Frontend Quick Start Guide
## Getting the Frontend Live for Users

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites Check
```bash
# Check Node.js version (need 18+)
node --version
# Should output: v18.x.x or higher

# Check npm version
npm --version
# Should output: 9.x.x or higher
```

### Install Dependencies
```bash
cd frontend
npm install
```

### Configure Environment
```bash
# Copy example environment file
cp .env.example .env.development

# Edit .env.development
# Update VITE_API_URL to point to your backend
```

### Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## 🎯 Implementation Roadmap

### Phase 1: Foundation (Week 1) - **START HERE**

#### Day 1-2: Core Infrastructure
```bash
# 1. Set up Redux store
mkdir -p src/store/slices
touch src/store/index.ts src/store/hooks.ts

# 2. Set up routing
mkdir -p src/pages/auth src/pages/employee src/pages/manager
touch src/pages/auth/LoginPage.tsx

# 3. Configure MUI theme with RTL
mkdir -p src/theme
touch src/theme/index.ts src/theme/palette.ts
```

**Files to Create:**
- `src/store/index.ts` - Redux store configuration
- `src/store/slices/authSlice.ts` - Authentication state
- `src/theme/index.ts` - MUI theme with RTL support
- `src/i18n/config.ts` - i18next configuration

#### Day 3-4: Authentication
```bash
# 1. Create auth service
mkdir -p src/services
touch src/services/api.ts src/services/authService.ts

# 2. Create login page
touch src/pages/auth/LoginPage.tsx

# 3. Create protected route
mkdir -p src/components/auth
touch src/components/auth/PrivateRoute.tsx
touch src/components/auth/RoleGuard.tsx
```

**Expected Outcome:**
- ✅ Users can login with credentials
- ✅ JWT token is stored and used for API calls
- ✅ Protected routes redirect to login if not authenticated
- ✅ Role-based access control works

#### Day 5: Testing
```bash
# Test authentication flow
npm run test:unit src/services/authService.test.ts
npm run test:component src/pages/auth/LoginPage.test.tsx
```

---

### Phase 2: Common Components (Week 2)

#### Priority Components
1. **Layout Components**
   - `src/components/common/Layout/MainLayout.tsx`
   - `src/components/common/Layout/Header.tsx`
   - `src/components/common/Layout/Sidebar.tsx`

2. **Data Display**
   - `src/components/common/DataTable/DataTable.tsx`
   - `src/components/common/Card/Card.tsx`

3. **Forms**
   - `src/components/common/Form/TextField.tsx`
   - `src/components/common/Form/DatePicker.tsx`
   - `src/components/common/Form/Select.tsx`

4. **Feedback**
   - `src/components/common/Loading/Spinner.tsx`
   - `src/components/common/Dialog/Dialog.tsx`

**Quick Implementation:**
```bash
# Generate component boilerplate
npm run generate:component DataTable
npm run generate:component Card
npm run generate:component TextField
```

---

### Phase 3: Employee Portal (Week 3)

#### Step-by-Step Implementation

**1. Create Employee Dashboard**
```typescript
// src/pages/employee/EmployeeDashboard.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyGoals } from '@/store/slices/goalsSlice';
import { Grid, Card, Typography } from '@mui/material';

export default function EmployeeDashboard() {
  const dispatch = useAppDispatch();
  const { goals } = useAppSelector(state => state.goals);

  useEffect(() => {
    dispatch(fetchMyGoals());
  }, [dispatch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <Typography variant="h6">أهدافي</Typography>
          {/* Goal list */}
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <Typography variant="h6">تقييماتي</Typography>
          {/* Evaluation list */}
        </Card>
      </Grid>
    </Grid>
  );
}
```

**2. Create Goals Service**
```typescript
// src/services/goalsService.ts
import api from './api';
import { Goal, CreateGoalRequest } from '@/types/goals.types';

export const goalsService = {
  async getMyGoals(): Promise<Goal[]> {
    const response = await api.get('/goals');
    return response.data.Data;
  },

  async createGoal(data: CreateGoalRequest): Promise<Goal> {
    const response = await api.post('/goals', data);
    return response.data.Data;
  },

  async updateProgress(id: string, progress: number): Promise<Goal> {
    const response = await api.put(`/goals/${id}/progress`, {
      progressPercent: progress
    });
    return response.data.Data;
  }
};
```

**3. Create Goals Redux Slice**
```typescript
// src/store/slices/goalsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { goalsService } from '@/services/goalsService';

export const fetchMyGoals = createAsyncThunk(
  'goals/fetchMy',
  async () => {
    return await goalsService.getMyGoals();
  }
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default goalsSlice.reducer;
```

**4. Create Goal Components**
```bash
# Goal list component
touch src/components/goals/GoalList.tsx

# Goal card component
touch src/components/goals/GoalCard.tsx

# Goal form component
touch src/components/goals/GoalForm.tsx

# Progress bar component
touch src/components/goals/ProgressBar.tsx
```

---

### Phase 4: Manager Portal (Week 4)

#### Key Features to Implement
1. **Team Goals Approval**
   - View pending goals
   - Approve/reject with notes
   - Send back for revision

2. **Team Evaluations**
   - Create evaluation
   - Enter scores (Goals, Behavior, Initiatives)
   - Finalize evaluation (auto-calculate final score)
   - View PIP creation notification

**Critical API Integrations:**
```typescript
// POST /api/goals/{id}/approve
await api.post(`/goals/${goalId}/approve`, {
  approved: true,
  notes: 'Great SMART goal!'
});

// POST /api/evaluations/{id}/finalize
const response = await api.post(`/evaluations/${evalId}/finalize`, {
  managerNotes: 'Good performance overall'
});
// Response includes: finalScore, finalRating, pipCreated
```

---

### Phase 5: HR Portal (Week 5)

#### Priority Features
1. **Company Dashboard**
   - Performance distribution chart
   - Department comparison
   - PIPs overview

2. **PIPs Management**
   - View all active PIPs
   - Monitor progress
   - Close PIPs

3. **Reports**
   - Export to Excel
   - Generate PDF reports

**Chart Implementation:**
```bash
npm install chart.js react-chartjs-2
```

```typescript
// Performance distribution pie chart
import { Pie } from 'react-chartjs-2';

const data = {
  labels: ['ممتاز', 'أعلى من المتوقع', 'مرضي', 'أقل من المتوقع', 'ضعيف'],
  datasets: [{
    data: [15, 35, 40, 8, 2],
    backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336']
  }]
};

<Pie data={data} />
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in `.env.production`
- [ ] API URL points to production backend
- [ ] Build succeeds without errors: `npm run build`
- [ ] Build size is acceptable (< 500KB gzipped)
- [ ] All tests pass: `npm run test`
- [ ] Lighthouse score > 90
- [ ] No console errors or warnings

### Build for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Test production build
open http://localhost:4173
```

### Deploy with Docker
```bash
# Build Docker image
docker build -t performance-system-frontend .

# Run container
docker run -p 3000:80 performance-system-frontend

# Or use docker-compose
cd ..
docker-compose up -d frontend
```

### Deploy to Cloud

**Option 1: Vercel (Easiest)**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Option 3: AWS S3 + CloudFront**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Option 4: Traditional Server (Nginx)**
```bash
# Build
npm run build

# Copy to server
scp -r dist/* user@server:/var/www/html/

# Nginx already configured via docker-compose
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
```
Access to XMLHttpRequest at 'http://localhost:5001/api/auth/login'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
Check backend `appsettings.json`:
```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:5173"
    ]
  }
}
```

### Issue 2: 401 Unauthorized
```
Request failed with status code 401
```

**Solution:**
Check if JWT token is being sent:
```typescript
// src/services/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Issue 3: RTL Not Working
**Solution:**
Ensure MUI theme has RTL enabled:
```typescript
import { createTheme } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const theme = createTheme({
  direction: 'rtl',
});

// In your App.tsx
<ThemeProvider theme={theme}>
  <CacheProvider value={cacheRtl}>
    <App />
  </CacheProvider>
</ThemeProvider>
```

### Issue 4: Build Fails
```
Error: Cannot find module '@mui/material'
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Progress Tracking

### Week 1 Checklist
- [ ] Redux store configured
- [ ] React Router configured
- [ ] MUI theme with RTL
- [ ] i18n with Arabic/English
- [ ] Login page working
- [ ] Protected routes working
- [ ] API service layer ready

### Week 2 Checklist
- [ ] 15+ reusable components built
- [ ] Storybook documentation
- [ ] Component tests written
- [ ] Layout components (Header, Sidebar, Footer)

### Week 3 Checklist
- [ ] Employee dashboard
- [ ] My Goals page
- [ ] My Evaluations page
- [ ] Profile page

### Week 4 Checklist
- [ ] Manager dashboard
- [ ] Team goals approval
- [ ] Team evaluations
- [ ] Performance charts

### Week 5 Checklist
- [ ] HR dashboard
- [ ] All employees page
- [ ] PIPs management
- [ ] Company reports

### Week 6 Checklist
- [ ] Admin dashboard
- [ ] User management
- [ ] System settings
- [ ] Audit logs

### Week 7 Checklist
- [ ] Executive dashboard
- [ ] Notifications system
- [ ] All features integrated

### Week 8 Checklist
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Production deployment
- [ ] User acceptance testing

---

## 🎯 Quick Wins (Get Something Live Fast)

### Minimal Viable Frontend (3 Days)

**Day 1: Authentication**
- Login page
- Token storage
- Protected routes

**Day 2: Employee Dashboard**
- Simple dashboard with goal list
- View goals only (no CRUD yet)

**Day 3: Deploy**
- Build and deploy to Vercel/Netlify
- Share link with stakeholders

**Result:** Working authentication + basic data display = **Proof of concept ready!**

---

## 📞 Getting Help

### Resources
- **Frontend Plan**: See `docs/FRONTEND_PLAN.md` for detailed plan
- **API Docs**: http://localhost:5001 (Swagger UI)
- **Backend Setup**: See `backend/SETUP.md`

### Team Communication
- Daily standups: 9:00 AM
- Code reviews: Required for all PRs
- Questions: #frontend-dev Slack channel

### Need Design Assets?
- Check Figma link (TBD)
- Saudi government design system
- Material Design guidelines with Arabic adaptations

---

**Ready to start? Let's build! 🚀**

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 and start coding! 💻
