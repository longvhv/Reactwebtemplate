# Scripts Directory

Chứa các scripts tiện ích cho project.

---

## 🔍 verify-react-native-ready.sh

Script verification tự động kiểm tra xem codebase có đạt chuẩn React Native Ready hay không.

### Usage

```bash
# Make executable (first time only)
chmod +x scripts/verify-react-native-ready.sh

# Run verification
./scripts/verify-react-native-ready.sh
```

### Alternative (without chmod)

```bash
bash scripts/verify-react-native-ready.sh
```

### What it checks

1. ✅ No direct `react-router-dom` imports (outside platform layer)
2. ✅ Platform abstraction is being used
3. ✅ localStorage usage is properly guarded
4. ✅ All platform layer files exist
5. ✅ Documentation files exist
6. ✅ Window API usage is safe
7. ✅ TypeScript compiles without errors

### Output Example

```
╔════════════════════════════════════════════════════════╗
║                                                        ║
║     REACT NATIVE READINESS VERIFICATION SCRIPT         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

Test 1: Checking for react-router-dom imports...
✅ PASSED: No direct react-router-dom imports found

Test 2: Checking platform abstraction usage...
✅ PASSED: Found 15 platform imports

...

╔════════════════════════════════════════════════════════╗
║                  VERIFICATION SUMMARY                  ║
╚════════════════════════════════════════════════════════╝

✅ Passed:   7
❌ Failed:   0
⚠️  Warnings: 0

╔════════════════════════════════════════════════════════╗
║                                                        ║
║         ✅ REACT NATIVE READY CERTIFIED ✅             ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### Exit Codes

- `0` - All tests passed, app is React Native Ready
- `1` - Some tests failed, fixes needed

### Use in CI/CD

```yaml
# .github/workflows/verify-rn-ready.yml
name: Verify React Native Ready

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run verification
        run: bash scripts/verify-react-native-ready.sh
```

---

## 📝 Adding More Scripts

Khi thêm scripts mới vào folder này:

1. Đặt tên file rõ ràng, dùng kebab-case
2. Thêm shebang `#!/bin/bash` ở đầu file
3. Thêm documentation trong file này
4. Set executable: `chmod +x scripts/your-script.sh`

---

## 🆘 Troubleshooting

### "Permission denied"
```bash
chmod +x scripts/verify-react-native-ready.sh
```

### "Command not found: grep"
Script requires standard Unix tools (grep, wc). Install via:
```bash
# macOS
brew install grep

# Ubuntu/Debian
sudo apt-get install grep
```

### "tsc: command not found"
TypeScript check will be skipped if `tsc` is not installed:
```bash
npm install -g typescript
```

---

**Happy Scripting! 🚀**
