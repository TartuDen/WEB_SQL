@echo off

REM Get the current directory of the batch script
set script_dir=%~dp0

REM Relative paths to the directories
set path1=%script_dir%game_API
set path2=%script_dir%express_game_forum

REM Commands to run in each terminal
set command1=nodemon index.js
set command2=nodemon server.js

REM Open a new terminal and run the first command
start cmd.exe /K "cd /d %path1% && %command1%"

REM Open another new terminal and run the second command
start cmd.exe /K "cd /d %path2% && %command2%"
