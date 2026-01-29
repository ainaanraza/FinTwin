import os
import sys

# Get the directory of the current file (api directory)
current_dir = os.path.dirname(__file__)

# Add the project root to sys.path
root_dir = os.path.join(current_dir, '..')
sys.path.append(root_dir)

# Add the backend directory to sys.path so 'services' module can be found
backend_dir = os.path.join(root_dir, 'backend')
sys.path.append(backend_dir)

from backend.main import app

# Vercel needs a variable named 'app'
# This file delegates everything to the backend.main:app
