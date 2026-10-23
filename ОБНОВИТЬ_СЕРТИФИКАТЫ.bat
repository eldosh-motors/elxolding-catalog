@echo off
setlocal
cd /d "%~dp0"

echo ===================================================
echo     ОБНОВЛЕНИЕ СЕРТИФИКАТОВ ELXOLDING
echo ===================================================
echo.

if not exist "сертификаты" (
    mkdir "сертификаты"
)
if not exist "assets\certificates" (
    mkdir "assets\certificates"
)

echo Копирование сертификатов...
copy /y "сертификаты\*.jpg" "assets\certificates\" >nul 2>&1
copy /y "сертификаты\*.jpeg" "assets\certificates\" >nul 2>&1
copy /y "сертификаты\*.png" "assets\certificates\" >nul 2>&1
copy /y "сертификаты\*.webp" "assets\certificates\" >nul 2>&1

py -3 "%~dp0update_certificates.py" >nul 2>&1
if errorlevel 1 (
    python "%~dp0update_certificates.py" >nul 2>&1
)

echo.
echo ===================================================
echo  ГОТОВО! Сертификаты успешно скопированы на сайт.
echo  Откройте GitHub Desktop и сделайте Push origin.
echo ===================================================
echo.
pause
