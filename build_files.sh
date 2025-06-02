#!/bin/bash
# Build script for Vercel deployment

# Make script executable
echo "Building static files..."

# Debug information
echo "Python version:"
python3 --version || echo "Python3 not found"

# Create staticfiles directory if it doesn't exist
mkdir -p staticfiles
echo "Created staticfiles directory"

# Install dependencies with verbose output
echo "Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Collect static files with verbose output
echo "Collecting static files..."
python3 manage.py collectstatic --noinput -v 2

# Copy static files manually as a fallback
echo "Copying static files manually as fallback..."
cp -r static/* staticfiles/ || echo "Manual copy failed, but continuing"

# List contents of staticfiles directory
echo "Contents of staticfiles directory:"
ls -la staticfiles/

echo "Build completed successfully!"