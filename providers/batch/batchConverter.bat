IF NOT EXIST ..\..\files\voicesToProcess%1 MKDIR ..\..\files\voicesToProcess%1
IF NOT EXIST ..\..\files\converted MKDIR ..\..\files\converted
IF NOT EXIST ..\..\files\voicesOri MKDIR ..\..\files\voicesOri
IF NOT EXIST ..\..\files\voices MKDIR ..\..\files\voices
IF NOT EXIST ..\..\files\_tmp MKDIR ..\..\files\_tmp
set count=0
move /Y ..\..\files\voices\* ..\..\files\voicesToProcess%1

FOR %%a IN ("..\..\files\voicesToProcess%1\*.*") DO (CALL :subroutine %%a %%~na %1)
REM ECHO run job -- files processed %count% -- date: %date% %time% >> ..\..\files\log.txt
RD /Q /S ..\..\files\voicesToProcess%1

:subroutine
    IF EXIST "%1" (
        ..\..\bin\ffmpeg -y -i "%1" "..\..\files\converted\%2.mp3"
        node sendEmail.js --fileName %2
        move /Y %1 ..\..\files\voicesOri
        set /a count+=1
    )
    GOTO :eof

