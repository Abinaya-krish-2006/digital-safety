@echo off
echo ====================================================
echo             TRUSTCHAIN AI - Starting Platform
echo ====================================================
echo Opening http://127.0.0.1:8000 in your browser...
start "" http://127.0.0.1:8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
