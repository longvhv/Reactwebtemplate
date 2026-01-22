# 👨‍💻 Development Documentation

Documentation về development guidelines, rules và best practices.

## 📁 Files trong thư mục này

### Main Guides
- **DEVELOPMENT-GUIDE.md** - Comprehensive development guide
- **OPTIONAL-DEPENDENCIES.md** - Optional dependencies guide

## 🎯 Development Guidelines

### Code Standards
- **Max file length**: 200 lines per file
- **Code quality**: SonarQube compliant
- **Principles**: DRY (Don't Repeat Yourself)
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with recommended rules

### Architecture
- **Framework**: React + Vite
- **Router**: React Router v7 (BrowserRouter)
- **State**: React hooks + Context API
- **i18n**: react-i18next
- **Styling**: Tailwind CSS v4
- **Components**: Modular, reusable

### File Structure
```
/
├── /components         # Reusable components
│   ├── /common        # Common components
│   ├── /layout        # Layout components
│   ├── /ui            # UI primitives
│   └── /...           # Feature components
├── /pages             # Page components
├── /hooks             # Custom hooks
├── /services          # API services
├── /lib               # Utilities
├── /constants         # Constants
├── /i18n              # Translations
└── /types             # TypeScript types
```

## 🔧 Development Tools

### Required
- Node.js 18+
- npm or yarn
- Git
- VS Code (recommended)

### Optional
- Prettier (code formatting)
- ESLint (linting)
- TypeScript (type checking)

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^7.x",
  "react-i18next": "^14.x",
  "i18next": "^23.x"
}
```

### UI Dependencies
```json
{
  "lucide-react": "icons",
  "recharts": "charts",
  "motion": "animations",
  "sonner": "toast notifications"
}
```

### Development Dependencies
```json
{
  "vite": "^5.x",
  "typescript": "^5.x",
  "tailwindcss": "^4.x",
  "@types/react": "^18.x"
}
```

## 🎨 Styling Guidelines

### Tailwind CSS v4
- Use Tailwind utility classes
- Follow design system tokens in `/styles/globals.css`
- Primary color: Indigo (#6366f1)
- Background: #fafafa

### Design Inspiration
- Stripe
- GitHub
- Vercel
- Linear

### Design Principles
- Modern
- Professional
- Elegant
- Clean
- Sophisticated

## 📝 Coding Rules

### TypeScript
```tsx
// ✅ Good - Typed props
interface ButtonProps {
  text: string;
  onClick: () => void;
}

function Button({ text, onClick }: ButtonProps) {
  return <button onClick={onClick}>{text}</button>;
}

// ❌ Bad - No types
function Button({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
```

### Component Structure
```tsx
// ✅ Good - Max 200 lines, single responsibility
import { useTranslation } from 'react-i18next';

interface Props { /* ... */ }

export function Component({ prop }: Props) {
  const { t } = useTranslation();
  
  // Logic here (max 50 lines)
  
  return (
    // JSX here (max 150 lines)
  );
}
```

### i18n Usage
```tsx
// ✅ Good - Using translations
const { t } = useTranslation();
<h1>{t('common.welcome')}</h1>

// ❌ Bad - Hardcoded text
<h1>Welcome</h1>
```

## 🚀 Development Workflow

### 1. Setup
```bash
npm install
npm run dev
```

### 2. Create Feature
1. Create component in `/components/`
2. Add translations to `/i18n/`
3. Add API service if needed
4. Write tests
5. Update documentation

### 3. Code Review Checklist
- [ ] Max 200 lines per file
- [ ] No hardcoded strings (use i18n)
- [ ] TypeScript types defined
- [ ] Components reusable
- [ ] DRY principle followed
- [ ] SonarQube compliant

## 🧪 Testing

### Unit Tests
```tsx
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

## 📖 Main Documentation Files

### For Developers
1. **Start here:** DEVELOPMENT-GUIDE.md
2. **Dependencies:** OPTIONAL-DEPENDENCIES.md

### Related Documentation
- Code structure: `/CODE_STRUCTURE.md`
- Development rules: `/DEVELOPMENT_RULES.md`
- Architecture: `/ARCHITECTURE.md`

---

**Last Updated:** 2026-01-16
