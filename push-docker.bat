@echo off
echo ========================================================
echo Pushing KRADIND Adventures to Docker Hub
echo Target: leoaddre/kradind-adventures:latest
echo ========================================================
echo.

docker push leoaddre/kradind-adventures:latest

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ========================================================
    echo [!] Authentication required. Please enter your Docker Hub credentials:
    echo ========================================================
    docker login
    echo.
    echo Retrying push to Docker Hub...
    docker push leoaddre/kradind-adventures:latest
)

echo.
echo ========================================================
echo Push process completed!
echo ========================================================
pause
