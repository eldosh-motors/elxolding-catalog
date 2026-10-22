@echo off
setlocal
if not defined SystemRoot set "SystemRoot=C:\Windows"
"%SystemRoot%\System32\chcp.com" 65001 >nul
cd /d "%~dp0"
"%~dp0..\софт\runtime\python.exe" "%~dp0build_catalog.py"
pause
