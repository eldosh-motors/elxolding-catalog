@echo off
chcp 65001 >nul
title Обновление каталога ELXOLDING
echo ========================================================
echo   АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ ЦЕН И ТОВАРОВ В КАТАЛОГЕ
echo ========================================================
echo.

if not exist "update_data" (
    mkdir "update_data"
    echo [i] Создана папка "update_data".
    echo Пожалуйста, положите файл Excel (.xlsx, .xls) или CSV в папку update_data и запустите снова.
    pause
    exit /b
)

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Ошибка: Python не найден в системе.
    echo Установите Python с официального сайта python.org (обязательно отметьте галочку "Add Python to PATH").
    pause
    exit /b
)

echo [1/3] Проверка библиотек Excel...
python -c "import openpyxl" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Установка библиотеки для чтения Excel (openpyxl)...
    pip install openpyxl
)

echo.
echo [2/3] Обработка файлов из папки "update_data"...
python update_catalog.py

echo.
echo [3/3] Завершено!
echo Если файлы обновились, не забудьте отправить изменения на GitHub (через GitHub Desktop: Commit -> Push).
echo.
pause
