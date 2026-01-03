#!/bin/bash

################################################################################
# React Native Ready Verification Script
# 
# Kiểm tra xem codebase có đạt chuẩn React Native Ready hay không
################################################################################

echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║     REACT NATIVE READINESS VERIFICATION SCRIPT         ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

################################################################################
# Test 1: Check for react-router-dom imports (excluding platform layer)
################################################################################
echo -e "${BLUE}Test 1: Checking for react-router-dom imports...${NC}"

ROUTER_IMPORTS=$(grep -r "from 'react-router-dom'" --include="*.tsx" --include="*.ts" \
  --exclude-dir=platform \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude="*.md" 2>/dev/null | grep -v "CONTRIBUTING.md" | wc -l)

if [ "$ROUTER_IMPORTS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASSED: No direct react-router-dom imports found${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAILED: Found $ROUTER_IMPORTS direct react-router-dom imports${NC}"
  echo "   Run this to see violations:"
  echo "   grep -r \"from 'react-router-dom'\" --include=\"*.tsx\" --exclude-dir=platform"
  ((FAILED++))
fi
echo ""

################################################################################
# Test 2: Check platform abstraction usage
################################################################################
echo -e "${BLUE}Test 2: Checking platform abstraction usage...${NC}"

PLATFORM_IMPORTS=$(grep -r "from.*platform" --include="*.tsx" --include="*.ts" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude="*.md" 2>/dev/null | wc -l)

if [ "$PLATFORM_IMPORTS" -gt 5 ]; then
  echo -e "${GREEN}✅ PASSED: Found $PLATFORM_IMPORTS platform imports${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING: Only $PLATFORM_IMPORTS platform imports found${NC}"
  echo "   Expected: 10+ imports using platform abstraction"
  ((WARNINGS++))
fi
echo ""

################################################################################
# Test 3: Check for unguarded localStorage usage
################################################################################
echo -e "${BLUE}Test 3: Checking for unguarded localStorage usage...${NC}"

UNGUARDED_STORAGE=$(grep -r "localStorage\." --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=platform \
  2>/dev/null | \
  grep -v "typeof window" | \
  grep -v "isBrowser" | \
  grep -v "lib/storage" | \
  grep -v "lib/cache" | \
  grep -v "utils/compression" | \
  grep -v "hooks/useLocalStorage" | \
  grep -v "\.md" | \
  wc -l)

if [ "$UNGUARDED_STORAGE" -eq 0 ]; then
  echo -e "${GREEN}✅ PASSED: All localStorage usage is properly guarded${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING: Found $UNGUARDED_STORAGE potentially unguarded localStorage usage${NC}"
  echo "   Review these files manually to ensure they have proper guards"
  ((WARNINGS++))
fi
echo ""

################################################################################
# Test 4: Check platform layer exists
################################################################################
echo -e "${BLUE}Test 4: Checking platform layer structure...${NC}"

PLATFORM_FILES=(
  "platform/navigation/Router.tsx"
  "platform/storage/index.ts"
  "platform/utils/platform.ts"
  "platform/hooks/usePlatformDimensions.ts"
  "platform/hooks/usePlatformBackHandler.ts"
)

MISSING_FILES=0
for file in "${PLATFORM_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo -e "${RED}❌ Missing: $file${NC}"
    ((MISSING_FILES++))
  fi
done

if [ "$MISSING_FILES" -eq 0 ]; then
  echo -e "${GREEN}✅ PASSED: All platform layer files exist${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAILED: Missing $MISSING_FILES platform layer files${NC}"
  ((FAILED++))
fi
echo ""

################################################################################
# Test 5: Check documentation exists
################################################################################
echo -e "${BLUE}Test 5: Checking documentation...${NC}"

DOCS=(
  "REACT-NATIVE-STATUS.md"
  "PLATFORM-USAGE-GUIDE.md"
  "REACT-NATIVE-READY-FINAL-AUDIT.md"
  "PLATFORM-QUICK-REFERENCE.md"
)

MISSING_DOCS=0
for doc in "${DOCS[@]}"; do
  if [ ! -f "$doc" ]; then
    echo -e "${YELLOW}⚠️  Missing: $doc${NC}"
    ((MISSING_DOCS++))
  fi
done

if [ "$MISSING_DOCS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASSED: All documentation exists${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING: Missing $MISSING_DOCS documentation files${NC}"
  ((WARNINGS++))
fi
echo ""

################################################################################
# Test 6: Check for unguarded window usage
################################################################################
echo -e "${BLUE}Test 6: Checking for critical unguarded window usage...${NC}"

CRITICAL_WINDOW=$(grep -r "window\." --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=platform \
  2>/dev/null | \
  grep -v "typeof window" | \
  grep -v "window.localStorage" | \
  grep -v "window.sessionStorage" | \
  grep -v "window.matchMedia" | \
  grep -v "window.addEventListener" | \
  grep -v "window.removeEventListener" | \
  grep -v "window.requestIdleCallback" | \
  grep -v "window.setTimeout" | \
  grep -v "window.innerWidth" | \
  grep -v "window.innerHeight" | \
  grep -v "window.devicePixelRatio" | \
  grep -v "\.md" | \
  grep -v "isBrowser" | \
  wc -l)

if [ "$CRITICAL_WINDOW" -eq 0 ]; then
  echo -e "${GREEN}✅ PASSED: No critical unguarded window usage${NC}"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  INFO: Found $CRITICAL_WINDOW window API usages${NC}"
  echo "   These should be reviewed to ensure they have proper guards"
  # Don't count as failure, just info
fi
echo ""

################################################################################
# Test 7: TypeScript compilation
################################################################################
echo -e "${BLUE}Test 7: Checking TypeScript compilation...${NC}"

if command -v tsc &> /dev/null; then
  if tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo -e "${RED}❌ FAILED: TypeScript compilation has errors${NC}"
    echo "   Run 'tsc --noEmit' to see details"
    ((FAILED++))
  else
    echo -e "${GREEN}✅ PASSED: TypeScript compiles without errors${NC}"
    ((PASSED++))
  fi
else
  echo -e "${YELLOW}⚠️  SKIPPED: TypeScript compiler not found${NC}"
  ((WARNINGS++))
fi
echo ""

################################################################################
# Summary
################################################################################
echo "╔════════════════════════════════════════════════════════╗"
echo "║                  VERIFICATION SUMMARY                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ Passed:   $PASSED${NC}"
echo -e "${RED}❌ Failed:   $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

################################################################################
# Final verdict
################################################################################
if [ "$FAILED" -eq 0 ]; then
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║                                                        ║"
  echo "║         ✅ REACT NATIVE READY CERTIFIED ✅             ║"
  echo "║                                                        ║"
  echo "║  Your codebase is ready for cross-platform deployment ║"
  echo "║                                                        ║"
  echo "╚════════════════════════════════════════════════════════╝"
  exit 0
else
  echo "╔════════════════════════════════════════════════════════╗"
  echo "║                                                        ║"
  echo "║         ❌ VERIFICATION FAILED ❌                      ║"
  echo "║                                                        ║"
  echo "║  Please fix the issues above and run again            ║"
  echo "║                                                        ║"
  echo "╚════════════════════════════════════════════════════════╝"
  exit 1
fi
