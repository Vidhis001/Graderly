@echo off
REM Load environment variables and start ML service

echo Loading environment variables from config.env...
if exist config.env (
    for /f "usebackq tokens=1,2 delims==" %%a in (config.env) do (
        if not "%%a"=="" if not "%%a:~0,1%"=="#" set %%a=%%b
    )
)

echo Starting ML Service...
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
