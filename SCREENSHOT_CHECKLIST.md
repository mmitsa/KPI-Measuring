# Screenshot & GIF Checklist
## قائمة التحقق من لقطات الشاشة

Use this checklist to track your progress:

---

## ⚙️ Setup (5 minutes)

- [ ] .NET SDK installed (`dotnet --version`)
- [ ] Node.js installed (`node --version`)
- [ ] Backend running on port 5001
- [ ] Frontend running on port 3000
- [ ] Browser window sized to 1920x1080
- [ ] Screenshot tool installed
- [ ] GIF recording tool installed

---

## 📸 Screenshots (10 minutes)

- [ ] **01-login-page.png** - Full login page view
- [ ] **02-login-credentials.png** - Login form filled
- [ ] **03-employee-dashboard.png** - Complete dashboard
- [ ] **04-goals-section.png** - Goals list close-up
- [ ] **05-goal-detail.png** - Single goal card
- [ ] **06-sidebar-menu.png** - Sidebar navigation
- [ ] **07-user-menu.png** - User dropdown menu
- [ ] **08-evaluations-section.png** - Evaluations display

**Saved to:** `docs/screenshots/`

---

## 🎬 GIF Demos (15 minutes)

- [ ] **demo-login-flow.gif** (5-10s)
  - Enter credentials
  - Click login
  - Show dashboard loading

- [ ] **demo-dashboard-tour.gif** (15-20s)
  - View statistics cards
  - Scroll through goals
  - Check evaluations
  - Open sidebar

- [ ] **demo-complete-workflow.gif** (30-45s)
  - Login process
  - Explore dashboard
  - Navigate menu
  - Logout

**Saved to:** `docs/demos/`

---

## 🎨 Optimization (5 minutes)

### Screenshots:
- [ ] Optimized using TinyPNG or similar
- [ ] File sizes < 500 KB each
- [ ] Resolution maintained (1920x1080)
- [ ] Clear and readable

### GIFs:
- [ ] Optimized using Ezgif or similar
- [ ] Frame rate: 10-15 fps
- [ ] Small GIFs < 5 MB
- [ ] Large GIFs < 15 MB
- [ ] Loop smoothly

---

## 📤 Upload to GitHub (5 minutes)

- [ ] Files copied to correct directories
  - `docs/screenshots/` for PNGs
  - `docs/demos/` for GIFs

- [ ] README.md updated
  - Uncommented image links
  - Verified markdown syntax

- [ ] Files committed
  ```bash
  git add docs/screenshots docs/demos README.md
  git commit -m "docs: add platform screenshots and demos"
  ```

- [ ] Pushed to GitHub
  ```bash
  git push
  ```

- [ ] Verified images display on GitHub
  - Screenshots load correctly
  - GIFs autoplay
  - Links work
  - Mobile view looks good

---

## ✅ Quality Check

- [ ] All images clear and professional
- [ ] No personal information visible
- [ ] Arabic text readable (RTL working)
- [ ] Saudi colors visible (green/gold)
- [ ] Progress bars displayed correctly
- [ ] Status chips colored appropriately
- [ ] GIFs smooth and not choppy
- [ ] File sizes optimized
- [ ] All 8 screenshots + 3 GIFs present

---

## 🎉 Completion

Once all items are checked:

**Total Time:** ~40 minutes
**Total Files:** 11 (8 PNGs + 3 GIFs)
**Status:** ✅ Complete

---

## 📝 Notes

Use this space for notes:

```
Example:
- Screenshot 1: Taken at 1920x1080, 324 KB
- GIF 1: 8 seconds, optimized to 3.2 MB
- Issue: Had to retake screenshot 3 due to loading spinner
```

---

## 🆘 Need Help?

If you encounter issues:

1. **Check:** `SCREENSHOTS_GUIDE.md` - Detailed instructions
2. **Run:** `bash scripts/prepare-screenshots.sh` - Setup script
3. **Verify:** Backend and frontend are running
4. **Test:** Login with `john.doe` / `Employee@123`
5. **Optimize:** Use online tools for file size reduction

---

**Quick Links:**
- [Detailed Guide](./SCREENSHOTS_GUIDE.md)
- [Demo Guide](./DEMO.md)
- [Frontend README](./frontend/README.md)
- [TinyPNG (optimize images)](https://tinypng.com/)
- [Ezgif (optimize GIFs)](https://ezgif.com/optimize)
- [ScreenToGif (Windows)](https://www.screentogif.com/)
- [LICEcap (Mac)](https://www.cockos.com/licecap/)
