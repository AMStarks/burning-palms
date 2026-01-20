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

# Some env pulls can include a literal "\n" escape in the URL (e.g. "?sslmode\n")
DATABASE_URL="${DATABASE_URL//\\n/}"
# Drop any query string entirely; we enforce SSL via PGSSLMODE
DATABASE_URL="${DATABASE_URL%%\?*}"

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

