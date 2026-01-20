#!/bin/bash
# Check and restart dev server

cd "/Users/starkers/Projects/Burning Palms"

echo "1. Killing any existing processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 2

echo "2. Starting dev server..."
npm run dev
