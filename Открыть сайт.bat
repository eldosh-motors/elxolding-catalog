@echo off
setlocal
if not defined SystemRoot set "SystemRoot=C:\Windows"
"%SystemRoot%\System32\chcp.com" 65001 >nul
start "" "%~dp0index.html"
