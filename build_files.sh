# Build script for Vercel deployment

# Make script executable
echo "Building static files..."

# Install dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Make migrations (optional, depends on your database setup)
# python manage.py makemigrations
# python manage.py migrate

echo "Build completed successfully!"