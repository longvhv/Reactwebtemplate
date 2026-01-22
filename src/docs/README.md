# 📚 VHV Platform - Documentation

Complete documentation for VHV Platform.

---

## 📂 Documentation Structure

```
/docs/
├── README.md                                   # This file
├── DOCUMENTATION-ORGANIZATION-COMPLETE.md     # Organization completion summary
├── ORGANIZATION_PLAN.md                       # Organization plan
│
├── /i18n/                                     # Internationalization (11 files)
│   └── README.md
├── /performance/                              # Performance optimization (7 files)
│   └── README.md
├── /navigation/                               # Navigation & routing (7 files)
│   └── README.md
├── /features/                                 # Feature documentation (4 files)
│   └── README.md
├── /development/                              # Development guides (2 files)
│   └── README.md
├── /ui/                                       # UI/UX design system (3 files)
│   └── README.md
├── /mobile/                                   # Mobile development (4 files)
│   └── README.md
│
├── API_DOCUMENTATION.md                       # API documentation
└── DATABASE_DOCS_API.md                       # Database documentation
```

---

## 🚀 Quick Navigation

### 🌍 Internationalization (i18n)
**Location:** [`/docs/i18n/`](./i18n/)

Multi-language support với react-i18next. 6 ngôn ngữ: Vietnamese, English, Spanish, Chinese, Japanese, Korean.

**Key files:**
- I18N-GUIDE.md - Hướng dẫn sử dụng i18n
- I18N-QUICK-REFERENCE.md - Quick reference
- I18N-MIGRATION-COMPLETE-SUMMARY.md - Migration status

**Status:** ✅ 4/6 languages complete (vi, en, es, zh)

---

### ⚡ Performance Optimization
**Location:** [`/docs/performance/`](./performance/)

Performance monitoring, optimization techniques và Web Vitals.

**Key files:**
- QUICKSTART-PERFORMANCE.md - Quick start guide
- PERFORMANCE-OPTIMIZATION.md - Optimization guide
- PERFORMANCE-CHECKLIST.md - Checklist

**Metrics:** FCP < 1.8s, LCP < 2.5s, CLS < 0.1

---

### 🧭 Navigation & Routing
**Location:** [`/docs/navigation/`](./navigation/)

React Router v7 implementation, navigation system và routing fixes.

**Key files:**
- NAVIGATION_COMPLETE_SUMMARY.md - Complete summary
- REACT_ROUTER_FIX.md - React Router implementation
- NAVIGATION_DEBUG.md - Debugging guide

**Router:** React Router v7 (BrowserRouter)

---

### 🎨 Features
**Location:** [`/docs/features/`](./features/)

Major features: Business Flow, User Stories, Developer Docs.

**Key files:**
- BUSINESS_FLOW_DETAIL_SETUP.md - Business flow setup
- COMPLETE_USER_STORIES_DOCUMENTATION.md - User stories
- FEATURE_TEMPLATE.md - Feature template

**Features:** Business Flow Detail, Dev Docs, User Stories

---

### 👨‍💻 Development
**Location:** [`/docs/development/`](./development/)

Development guidelines, code standards và best practices.

**Key files:**
- DEVELOPMENT-GUIDE.md - Development guide
- OPTIONAL-DEPENDENCIES.md - Dependencies

**Standards:** 200 lines/file, DRY, SonarQube compliant

---

### 🎨 UI/UX Design
**Location:** [`/docs/ui/`](./ui/)

Design system, modern UI components và styling guidelines.

**Key files:**
- DEVDOCS_MODERN_UI.md - Modern UI
- DEVDOCS_REDESIGN.md - Redesign docs
- DEVDOCS_UI_UPDATE.md - UI updates

**Design:** Stripe + GitHub + Vercel + Linear inspired  
**Colors:** Indigo (#6366f1), Background (#fafafa)  
**Font:** Inter

---

### 📱 Mobile Development
**Location:** [`/docs/mobile/`](./mobile/)

Flutter và Android development documentation.

**Key files:**
- FLUTTER_INTEGRATION.md - Flutter guide
- FLUTTER_PROJECT_SUMMARY.md - Project overview
- ANDROID_SETUP_SUMMARY.md - Android setup

**Platform:** Flutter 3.x, Android 7.0+ (API 24+)  
**Architecture:** Clean Architecture + BLoC

---

### 🗄️ Database & API
**Location:** `/docs/`

Database schema và API documentation.

**Files:**
- API_DOCUMENTATION.md - API endpoints
- DATABASE_DOCS_API.md - Database schema

**Related:** `/sql/` - SQL migration scripts

---

## 📋 Documentation Categories

### By Technology
- **Frontend:** React + Vite + React Router v7
- **Styling:** Tailwind CSS v4
- **i18n:** react-i18next
- **Mobile:** Flutter + Dart
- **Backend:** Golang (see `/golang-backend/`)
- **Database:** MySQL/PostgreSQL (see `/sql/`)

### By Role

**For Developers:**
- Start: `/docs/development/DEVELOPMENT-GUIDE.md`
- i18n: `/docs/i18n/I18N-GUIDE.md`
- Performance: `/docs/performance/QUICKSTART-PERFORMANCE.md`
- Navigation: `/docs/navigation/NAVIGATION_COMPLETE_SUMMARY.md`

**For Designers:**
- UI System: `/docs/ui/DEVDOCS_MODERN_UI.md`
- Design tokens: `/styles/globals.css`

**For Mobile Developers:**
- Flutter: `/docs/mobile/FLUTTER_INTEGRATION.md`
- Android: `/docs/mobile/ANDROID_SETUP_SUMMARY.md`

**For Product Managers:**
- Features: `/docs/features/COMPLETE_USER_STORIES_DOCUMENTATION.md`
- Business flow: `/docs/features/BUSINESS_FLOW_DETAIL_SETUP.md`

**For DevOps:**
- Performance: `/docs/performance/CHANGELOG-PERFORMANCE.md`
- Database: `/sql/README.md`

---

## 🎯 Project Overview

### Main Documentation (Root)
Essential documents at project root:
- **README.md** - Main project README
- **PROJECT_STATUS.md** - Current project status
- **ARCHITECTURE.md** - System architecture
- **QUICKSTART.md** - Quick start guide
- **CONTRIBUTING.md** - Contribution guidelines
- **CODE_STRUCTURE.md** - Code structure overview
- **DEVELOPMENT_RULES.md** - Development rules

### Technology Stack
```
Frontend:
- React 18
- Vite 5
- React Router v7 (BrowserRouter)
- Tailwind CSS v4
- TypeScript 5
- react-i18next

Mobile:
- Flutter 3.x
- Dart
- BLoC pattern
- Clean Architecture

Backend:
- Golang
- Gin framework
- MySQL/PostgreSQL
- JWT authentication

Infrastructure:
- Git version control
- npm package manager
- Vite build tool
```

### Code Standards
- **Max file length:** 200 lines
- **Code quality:** SonarQube compliant
- **Principles:** DRY (Don't Repeat Yourself)
- **i18n:** All text must use translations
- **TypeScript:** Strict mode enabled

---

## 📊 Documentation Statistics

| Category | Files | Status |
|----------|-------|--------|
| i18n | 11 | ✅ Complete |
| Performance | 7 | ✅ Complete |
| Navigation | 7 | ✅ Complete |
| Features | 4 | ✅ Complete |
| Development | 2 | ✅ Complete |
| UI/UX | 3 | ✅ Complete |
| Mobile | 4 | ✅ Complete |
| Database/API | 2 | ✅ Complete |
| **Total** | **40** | **100%** |

---

## 🔍 Search Documentation

### By Topic
- **i18n/translations:** `/docs/i18n/`
- **Performance:** `/docs/performance/`
- **Routing:** `/docs/navigation/`
- **Features:** `/docs/features/`
- **Coding standards:** `/docs/development/`
- **Design system:** `/docs/ui/`
- **Mobile app:** `/docs/mobile/`
- **API:** `/docs/API_DOCUMENTATION.md`
- **Database:** `/docs/DATABASE_DOCS_API.md` + `/sql/`

### By File Name
Use project search to find specific documentation files.

---

## 📝 Documentation Rules

### Location Rules
1. **Root (/):** ONLY overview documents (README, ARCHITECTURE, QUICKSTART, etc.)
2. **/docs/:** ALL detailed documentation, organized by category
3. **/sql/:** ALL SQL migration scripts

### Naming Conventions
- Descriptive names with hyphens: `feature-name-documentation.md`
- UPPERCASE for important docs: `README.md`, `ARCHITECTURE.md`
- Category prefix if needed: `I18N-migration-guide.md`

### Organization
- Group related docs in subfolders
- Each subfolder must have README.md
- Cross-reference documents with relative links
- Keep documentation DRY

### Maintenance
- Update docs when code changes
- Archive outdated docs to `/docs/archive/`
- Follow the same standards as code (max 200 lines recommended)

---

## 🚀 Getting Started

### For New Developers
1. Read `/README.md` (project overview)
2. Read `/QUICKSTART.md` (quick start)
3. Read `/ARCHITECTURE.md` (architecture)
4. Read `/docs/development/DEVELOPMENT-GUIDE.md` (development guide)
5. Read `/docs/i18n/I18N-GUIDE.md` (i18n usage)

### For Specific Tasks
- **Adding i18n:** Read `/docs/i18n/I18N-GUIDE.md`
- **Optimizing performance:** Read `/docs/performance/QUICKSTART-PERFORMANCE.md`
- **Adding routes:** Read `/docs/navigation/REACT_ROUTER_FIX.md`
- **Creating features:** Read `/docs/features/FEATURE_TEMPLATE.md`
- **Styling components:** Read `/docs/ui/DEVDOCS_MODERN_UI.md`
- **Mobile development:** Read `/docs/mobile/FLUTTER_INTEGRATION.md`

---

## 🤝 Contributing to Documentation

### Adding New Documentation
1. Choose appropriate subfolder in `/docs/`
2. Create markdown file with descriptive name
3. Update subfolder's README.md
4. Cross-reference from related docs
5. Follow documentation rules above

### Updating Existing Documentation
1. Edit the relevant file
2. Update "Last Updated" date
3. Notify team of changes
4. Archive old versions if major changes

---

## 📞 Support

For questions about documentation:
- Check `/README.md` first
- Search in `/docs/` subfolders
- Check `/CONTRIBUTING.md` for contribution guidelines
- Review `/PROJECT_STATUS.md` for current status

---

**Total Documentation Files:** 40+  
**Organization:** 100% Complete  
**Last Updated:** 2026-01-16  
**Maintained by:** VHV Platform Team

---

Made with ❤️ by VHV Platform Team
