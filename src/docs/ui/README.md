# 🎨 UI/UX Documentation

Documentation về UI design system, redesign và modern UI updates.

## 📁 Files trong thư mục này

### Main Documentation
- **DEVDOCS_MODERN_UI.md** - Modern UI implementation
- **DEVDOCS_REDESIGN.md** - UI redesign documentation
- **DEVDOCS_UI_UPDATE.md** - UI updates and improvements

## 🎯 Design System

### Design Inspiration
- **Stripe** - Clean payment interface
- **GitHub** - Developer-friendly UI
- **Vercel** - Modern deployment platform
- **Linear** - Elegant issue tracking

### Design Principles
- **Modern** - Contemporary design patterns
- **Professional** - Enterprise-grade quality
- **Elegant** - Refined aesthetics
- **Clean** - Minimal and focused
- **Sophisticated** - Polished details

## 🎨 Design Tokens

### Colors
```css
/* Primary Color - Indigo */
--color-primary: #6366f1;
--color-primary-hover: #4f46e5;
--color-primary-light: #a5b4fc;

/* Background */
--color-bg: #fafafa;
--color-bg-secondary: #ffffff;
--color-bg-tertiary: #f3f4f6;

/* Text */
--color-text-primary: #111827;
--color-text-secondary: #6b7280;
--color-text-tertiary: #9ca3af;

/* Borders */
--color-border: #e5e7eb;
--color-border-hover: #d1d5db;
```

### Typography
```css
/* Font Family */
--font-sans: 'Inter', system-ui, sans-serif;

/* Font Sizes - Use from globals.css */
/* Don't override with Tailwind classes unless requested */
```

### Spacing
```css
/* Follow Tailwind spacing scale */
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
```

## 🧩 UI Components

### Layout Components
- `<AppLayout />` - Main application layout
- `<Header />` - Header with navigation
- `<StatusBar />` - Status bar
- `<LoadingBar />` - Progress loading bar

### Navigation Components
- `<Breadcrumb />` - Breadcrumb navigation
- `<CommandPalette />` - Command palette (Cmd+K)
- `<QuickActionsDropdown />` - Quick actions menu
- `<NotificationsDropdown />` - Notifications
- `<UserProfileDropdown />` - User profile menu

### Common Components
- `<DataTable />` - Data table with sorting/filtering
- `<EmptyState />` - Empty state placeholder
- `<LoadingSpinner />` - Loading spinner
- `<ConfirmDialog />` - Confirmation dialog
- `<LanguageSwitcher />` - Language switcher

### UI Primitives (/components/ui)
- Button, Card, Dialog, Dropdown
- Input, Textarea, Select, Checkbox
- Badge, Alert, Toast, Tooltip
- Tabs, Accordion, Popover, Sheet
- And more...

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach
```tsx
// ✅ Good - Mobile first
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>

// ❌ Bad - Desktop first
<div className="w-1/3 lg:w-1/2 md:w-full">
  Content
</div>
```

## 🎨 Component Styling Guide

### Using Tailwind CSS v4
```tsx
// ✅ Good - Semantic class names
<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
  Click me
</button>

// ⚠️ Avoid - Font size/weight classes (use globals.css defaults)
<h1 className="text-2xl font-bold">Title</h1>  // Only if explicitly requested

// ✅ Good - Use defaults from globals.css
<h1>Title</h1>  // Uses h1 styles from globals.css
```

### Dark Mode Support
```tsx
// Support for dark mode
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Text</p>
</div>
```

## 🚀 UI Features

### Modern UI Features
- ✅ Gradient backgrounds
- ✅ Smooth animations (motion/react)
- ✅ Glassmorphism effects
- ✅ Hover states and transitions
- ✅ Focus states for accessibility
- ✅ Loading states
- ✅ Empty states
- ✅ Error states

### Interactive Features
- ✅ Command palette (Cmd+K)
- ✅ Toast notifications (Sonner)
- ✅ Tooltips
- ✅ Dropdown menus
- ✅ Modal dialogs
- ✅ Slide-over panels

## ♿ Accessibility

### WCAG 2.1 Level AA
- ✅ Color contrast ratios
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ ARIA attributes
- ✅ Semantic HTML

### Accessibility Best Practices
```tsx
// ✅ Good - Accessible button
<button
  aria-label="Close dialog"
  onClick={onClose}
  className="focus:ring-2 focus:ring-indigo-500"
>
  <X className="w-4 h-4" />
  <span className="sr-only">Close</span>
</button>
```

## 📖 Main Documentation Files

### For Designers
1. **Modern UI:** DEVDOCS_MODERN_UI.md
2. **Redesign:** DEVDOCS_REDESIGN.md
3. **UI Updates:** DEVDOCS_UI_UPDATE.md

### Related Documentation
- Design system tokens: `/styles/globals.css`
- UI components: `/components/ui/`
- Common components: `/components/common/`

---

**Design System:** Stripe + GitHub + Vercel + Linear inspired  
**CSS Framework:** Tailwind CSS v4  
**Font:** Inter  
**Primary Color:** Indigo (#6366f1)  
**Last Updated:** 2026-01-16
