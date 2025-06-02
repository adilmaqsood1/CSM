from django.shortcuts import render

def index(request):
    """View for the landing page."""
    return render(request, 'landing_page/index.html')
