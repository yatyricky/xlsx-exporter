Remove-Item -Recurse .\js\*
Remove-Item -Recurse .\dist\*
tsc
webpack-cli.cmd -p
