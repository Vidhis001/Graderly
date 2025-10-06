#!/usr/bin/env python3
"""
ML Service Runner with Environment Loading
"""
import os
import subprocess
from pathlib import Path

def load_env_file(env_file):
    """Load environment variables from file"""
    if not Path(env_file).exists():
        print(f"Warning: {env_file} not found")
        return
    
    with open(env_file, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value
                print(f"Loaded: {key}")

if __name__ == "__main__":
    # Load environment variables
    load_env_file("config.env")
    
    # Start uvicorn server
    print("Starting ML Service...")
    subprocess.run([
        "uvicorn", 
        "app.main:app", 
        "--host", "0.0.0.0", 
        "--port", "8000",
        "--reload"
    ])
