Remove-Item -Recurse .\dist\*
tsc
node .\dist\Main.js
