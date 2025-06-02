#!/bin/bash
# Build script for Vercel deployment

# Make script executable
echo "Building static files..."

# Create staticfiles directory if it doesn't exist
mkdir -p staticfiles

# Install dependencies
python3 -m pip install -r requirements.txt

# Collect static files
python3 manage.py collectstatic --noinput

# Make migrations (optional, depends on your database setup)
# python3 manage.py makemigrations
# python3 manage.py migrate

echo "Build completed successfully!"