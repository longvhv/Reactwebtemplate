# 📱 Mobile Development Documentation

Documentation về Flutter và Android development cho VHV Platform.

## 📁 Files trong thư mục này

### Main Documentation
- **FLUTTER_INTEGRATION.md** - Flutter integration guide
- **FLUTTER_PROJECT_SUMMARY.md** - Flutter project overview
- **ANDROID_SETUP_SUMMARY.md** - Android setup guide
- **README-FRAMEWORK.md** - Framework documentation

## 🎯 Mobile Platform Support

### Flutter App
- **Platform**: Cross-platform (iOS & Android)
- **Framework**: Flutter 3.x
- **Language**: Dart
- **Architecture**: Clean Architecture + BLoC pattern
- **Location**: `/flutter/` directory

### Android Native
- **Platform**: Android 7.0+ (API 24+)
- **Language**: Kotlin
- **Build System**: Gradle
- **Location**: `/flutter/android/`

## 📱 Flutter Architecture

### Project Structure
```
/flutter/
├── /lib/
│   ├── /core/
│   │   ├── /di/              # Dependency injection
│   │   ├── /l10n/            # Localization
│   │   ├── /network/         # API client
│   │   ├── /router/          # Navigation
│   │   └── /theme/           # App theme
│   ├── /features/
│   │   ├── /auth/            # Authentication
│   │   ├── /dashboard/       # Dashboard
│   │   ├── /profile/         # User profile
│   │   └── /settings/        # Settings
│   └── main.dart
├── /android/                  # Android specific
├── pubspec.yaml              # Dependencies
└── README.md
```

### Clean Architecture Layers
```
┌─────────────────────────────────┐
│     Presentation Layer          │
│  (BLoC, Pages, Widgets)         │
├─────────────────────────────────┤
│      Domain Layer               │
│  (Use Cases, Entities)          │
├─────────────────────────────────┤
│       Data Layer                │
│  (Repositories, Data Sources)   │
└─────────────────────────────────┘
```

## 🌐 Supported Languages (Mobile)

| Language | Code | Status |
|----------|------|--------|
| Vietnamese | vi | ✅ Complete |
| English | en | ✅ Complete |
| Spanish | es | ✅ Complete |
| Chinese | zh | ✅ Complete |
| Japanese | ja | ✅ Complete |
| Korean | ko | ✅ Complete |

## 🔧 Setup & Installation

### Prerequisites
```bash
# Flutter SDK
flutter --version  # 3.x required

# Android SDK
android --version  # API 24+ required

# Dart
dart --version
```

### Quick Start
```bash
# Navigate to Flutter directory
cd flutter/

# Get dependencies
flutter pub get

# Run on Android
flutter run -d android

# Build APK
flutter build apk --release

# Build App Bundle
flutter build appbundle --release
```

## 🚀 Features

### Authentication
- ✅ Email/Password login
- ✅ JWT token management
- ✅ Auto-login (remember me)
- ✅ Logout
- ✅ Session management

### Dashboard
- ✅ Statistics overview
- ✅ Recent activity
- ✅ Quick actions
- ✅ Charts and graphs

### Profile
- ✅ View profile
- ✅ Edit profile
- ✅ Avatar upload
- ✅ Activity history

### Settings
- ✅ Language switcher (6 languages)
- ✅ Theme switcher (light/dark)
- ✅ Appearance settings
- ✅ Notification preferences

## 🎨 Design System (Mobile)

### Theme
- **Light mode** - Default
- **Dark mode** - Full support
- **Colors** - Match web design (Indigo primary)
- **Typography** - Inter font family

### Components
- Material Design 3
- Custom widgets
- Reusable components
- Platform-specific designs

## 📦 Dependencies

### Core Dependencies
```yaml
# Flutter SDK
flutter:
  sdk: flutter

# State Management
flutter_bloc: ^8.x
equatable: ^2.x

# HTTP Client
dio: ^5.x

# Storage
shared_preferences: ^2.x

# Localization
flutter_localizations:
  sdk: flutter
intl: ^0.18.x

# Navigation
go_router: ^13.x
```

### UI Dependencies
```yaml
# Icons
cupertino_icons: ^1.x

# Loading
flutter_spinkit: ^5.x

# Image
cached_network_image: ^3.x

# Charts
fl_chart: ^0.66.x
```

## 🔐 Security

### Android Security
- **ProGuard** - Code obfuscation enabled
- **Certificate pinning** - API security
- **Secure storage** - Encrypted preferences
- **Network security** - HTTPS only

### Build Variants
```
/flutter/android/app/
├── src/
│   ├── debug/          # Debug build
│   ├── profile/        # Profile build
│   └── main/           # Release build
```

## 🧪 Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

### Widget Tests
```bash
flutter test test/
```

## 📱 Android Build

### Debug Build
```bash
flutter build apk --debug
```

### Release Build
```bash
# Generate keystore first
cd flutter/android
./scripts/generate-keystore.sh

# Build release
flutter build apk --release
flutter build appbundle --release
```

### Build Variants
- **Development** - Debug features enabled
- **Staging** - Testing environment
- **Production** - Release build

## 📖 Main Documentation Files

### For Mobile Developers
1. **Flutter guide:** FLUTTER_INTEGRATION.md
2. **Project overview:** FLUTTER_PROJECT_SUMMARY.md
3. **Android setup:** ANDROID_SETUP_SUMMARY.md
4. **Framework:** README-FRAMEWORK.md

### Related Documentation
- Flutter app: `/flutter/README.md`
- Android guide: `/flutter/ANDROID_BUILD_GUIDE.md`
- Architecture: `/flutter/ARCHITECTURE.md`

---

**Mobile Framework:** Flutter 3.x  
**Android Support:** API 24+ (Android 7.0+)  
**Architecture:** Clean Architecture + BLoC  
**Languages:** 6 languages supported  
**Last Updated:** 2026-01-16
