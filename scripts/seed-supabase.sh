#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env.production"

if [ ! -f "${ENV_FILE}" ]; then
  echo "❌ Missing .env.production"
  echo "Run: vercel env pull .env.production --environment=production"
  exit 1
fi

DATABASE_URL="$(grep "^DATABASE_URL=" "${ENV_FILE}" | head -1 | cut -d '=' -f2- | sed 's/^"//;s/"$//' | tr -d '"' | tr -d '\r')"

if [ -z "${DATABASE_URL}" ]; then
  echo "❌ DATABASE_URL not found in .env.production"
  exit 1
fi

export DATABASE_URL
export PGSSLMODE="require"

echo "🌱 Seeding Supabase database..."
echo ""

cd "${PROJECT_ROOT}"
npx tsx prisma/seed.ts

echo ""
echo "✅ Seed completed."

