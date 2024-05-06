from django.shortcuts import render

from django.http import FileResponse
from django.conf import settings
import os

def index(request):
    return render(request, 'index.html')

def glb_file(request):
    glb_path = os.path.join(settings.BASE_DIR, 'static', 'frontend_01', 'dist', 'city-transformed.glb')
    return FileResponse(open(glb_path, 'rb'))