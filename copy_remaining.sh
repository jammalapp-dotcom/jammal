#!/bin/bash
# سكريبت نسخ الملفات المتبقية من المشروع الأصلي إلى الـ monorepo
# الملفات التي تم إنشاؤها يدوياً لن تُكتب فوقها

SRC="/Users/abdullah/Desktop/Jammal-9b5eqc-main"
DST="/Users/abdullah/Desktop/Desktop - Abdullah's MacBook Air/jammal_app/apps/mobile"

echo "🔄 بدء نسخ الملفات المتبقية..."

# === شاشات الأدوار ===
# Driver screens
for f in _layout.tsx index.tsx jobs.tsx earnings.tsx profile.tsx; do
  mkdir -p "$DST/app/(driver)"
  [ ! -f "$DST/app/(driver)/$f" ] && cp "$SRC/app/(driver)/$f" "$DST/app/(driver)/$f" && echo "✅ app/(driver)/$f"
done

# Broker screens
for f in _layout.tsx index.tsx fleet.tsx shipments.tsx profile.tsx; do
  mkdir -p "$DST/app/(broker)"
  [ ! -f "$DST/app/(broker)/$f" ] && cp "$SRC/app/(broker)/$f" "$DST/app/(broker)/$f" && echo "✅ app/(broker)/$f"
done

# Manager screens
for f in _layout.tsx index.tsx shipments.tsx users.tsx settings.tsx; do
  mkdir -p "$DST/app/(manager)"
  [ ! -f "$DST/app/(manager)/$f" ] && cp "$SRC/app/(manager)/$f" "$DST/app/(manager)/$f" && echo "✅ app/(manager)/$f"
done

# === Sub-screens ===
for sub in bids chat payment shipment; do
  mkdir -p "$DST/app/$sub"
  [ ! -f "$DST/app/$sub/[id].tsx" ] && cp "$SRC/app/$sub/[id].tsx" "$DST/app/$sub/[id].tsx" && echo "✅ app/$sub/[id].tsx"
done

# === Assets ===
if [ ! -d "$DST/assets" ]; then
  cp -R "$SRC/assets" "$DST/assets"
  echo "✅ assets/ (كل الصور)"
else
  echo "⏭️  assets/ موجود مسبقاً"
fi

# === eas.json ===
[ ! -f "$DST/eas.json" ] && [ -f "$SRC/eas.json" ] && cp "$SRC/eas.json" "$DST/eas.json" && echo "✅ eas.json"

echo ""
echo "✅ تم نسخ كل الملفات المتبقية!"
echo ""
echo "الخطوة التالية:"
echo "  cd \"$DST/../..\""
echo "  pnpm install"
echo "  pnpm type-check"
