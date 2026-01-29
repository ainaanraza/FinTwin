import os
import sys

# Add the parent directory (project root) to sys.path so 'backend' can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.main import app

# Vercel needs a variable named 'app' to be the entry point
# This file delegates everything to the backend.main:app
