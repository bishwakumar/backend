#!/bin/bash
# Find and run the dist/main.js file
# This script handles different working directory scenarios on Render

echo "Starting application..."
echo "Current directory: $(pwd)"

# Try current directory first
if [ -f "dist/main.js" ]; then
  echo "Found dist/main.js in current directory"
  node dist/main.js
  exit $?
fi

# Try parent directory (if we're in src/)
if [ -f "../dist/main.js" ]; then
  echo "Found dist/main.js in parent directory"
  cd .. && node dist/main.js
  exit $?
fi

# Try dist/src/main.js (some build configurations)
if [ -f "dist/src/main.js" ]; then
  echo "Found dist/src/main.js in current directory"
  node dist/src/main.js
  exit $?
fi

# Try ../dist/src/main.js
if [ -f "../dist/src/main.js" ]; then
  echo "Found dist/src/main.js in parent directory"
  cd .. && node dist/src/main.js
  exit $?
fi

echo "Error: Could not find dist/main.js or dist/src/main.js"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la
if [ -d ".." ]; then
  echo "Parent directory contents:"
  ls -la ..
fi
if [ -d "dist" ]; then
  echo "Dist directory contents:"
  ls -la dist/
fi
exit 1

