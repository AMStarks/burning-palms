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

if ! command -v psql >/dev/null 2>&1; then
  echo "❌ psql not found."
  echo "Install Postgres client tools, e.g.: brew install libpq && brew link --force libpq"
  exit 1
fi

DATABASE_URL="$(grep "^DATABASE_URL=" "${ENV_FILE}" | head -1 | cut -d '=' -f2- | sed 's/^"//;s/"$//' | tr -d '"')"

if [ -z "${DATABASE_URL}" ]; then
  echo "❌ DATABASE_URL not found in .env.production"
  exit 1
fi

# Ensure sslmode=require for Supabase
if [[ "${DATABASE_URL}" != *"sslmode="* ]]; then
  if [[ "${DATABASE_URL}" == *"?"* ]]; then
    DATABASE_URL="${DATABASE_URL}&sslmode=require"
  else
    DATABASE_URL="${DATABASE_URL}?sslmode=require"
  fi
fi

echo "🚀 Bootstrapping Supabase schema via psql..."
echo "   (This may take ~10-30s)"
echo ""

# Use ON_ERROR_STOP so any failure exits non-zero
psql "${DATABASE_URL}" -v ON_ERROR_STOP=1 -f "${SQL_FILE}"

echo ""
echo "✅ Supabase schema bootstrap completed."
