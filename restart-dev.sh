#!/bin/bash

# Kill any existing Next.js processes
echo "Killing existing Next.js processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Remove lock file if it exists
rm -f .next/dev/lock 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 2

# Change to project directory and start dev server
cd "/Users/starkers/Projects/Burning Palms"
echo "Starting dev server..."
npm run dev
