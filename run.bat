@echo off
title Starting Murder Bees Server

cd /d "%~dp0"
start cmd /k "node buzz.mjs"
timeout /t 2 /nobreak >nul
start http://localhost:3000
exit
