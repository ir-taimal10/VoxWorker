IF NOT EXIST Z:files\voicesToProcess%1 MKDIR Z:files\voicesToProcess%1
IF NOT EXIST Z:files\converted MKDIR Z:files\converted
IF NOT EXIST Z:files\voicesOri MKDIR Z:files\voicesOri
IF NOT EXIST Z:files\voices MKDIR Z:files\voices
IF NOT EXIST Z:files\_tmp MKDIR Z:files\_tmp
set count=0
move /Y Z:files\voices\* Z:files\voicesToProcess%1

FOR %%a IN ("Z:files\voicesToProcess%1\*.*") DO (CALL :subroutine %%a %%~na %1)
REM ECHO run job -- files processed %count% -- date: %date% %time% >> Z:files\log.txt
RD /Q /S Z:files\voicesToProcess%1

:subroutine
    IF EXIST "%1" (
       ..\..\bin\ffmpeg -y -i "%1" "Z:files\converted\%2.mp3"
        node sendEmailAWS.js --fileName %2
        move /Y %1 Z:files\voicesOri
        set /a count+=1
    )
    GOTO :eof

