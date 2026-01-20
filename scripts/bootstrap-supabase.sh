#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env.production"
SQL_FILE="${PROJECT_ROOT}/supabase-bootstrap.sql"

if [ ! -f "${ENV_FILE}" ]; then
  echo "❌ Missing .env.production"
  echo "Run: vercel env pull .env.production --environment=production"
  exit 1
fi

if [ ! -f "${SQL_FILE}" ]; then
  echo "❌ Missing supabase-bootstrap.sql"
  exit 1
fi

PSQL_BIN="$(command -v psql 2>/dev/null || true)"
if [ -z "${PSQL_BIN}" ] && [ -x "/opt/homebrew/opt/libpq/bin/psql" ]; then
  PSQL_BIN="/opt/homebrew/opt/libpq/bin/psql"
fi

if [ -z "${PSQL_BIN}" ]; then
  echo "❌ psql not found."
  echo "Install Postgres client tools:"
  echo "  brew install libpq"
  echo "Then add it to PATH:"
  echo "  echo 'export PATH=\"/opt/homebrew/opt/libpq/bin:$PATH\"' >> ~/.zshrc"
  echo "  source ~/.zshrc"
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

export PGSSLMODE="require"

echo "🚀 Bootstrapping Supabase schema via psql..."
echo "   (This may take ~10-30s)"
echo ""

# Use ON_ERROR_STOP so any failure exits non-zero
"${PSQL_BIN}" "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${SQL_FILE}"

echo ""
echo "✅ Supabase schema bootstrap completed."
