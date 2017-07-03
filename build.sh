#!/bin/sh
npm run build
cd ./build
../node_modules/.bin/pkg app.js

mv app-linux aliyun-ddns-linux
mv app-macos aliyun-ddns-macos
mv app-win.exe aliyun-ddns-windows.exe

cp ../config-sample.json ./

tar czvf aliyun-ddns-linux-x64.tar.gz ./aliyun-ddns-linux ./config-sample.json 
tar czvf aliyun-ddns-macos-x64.tar.gz ./aliyun-ddns-macos ./config-sample.json 
tar czvf aliyun-ddns-windows-x64.tar.gz ./aliyun-ddns-windows.exe ./config-sample.json 

rm -rf ./config-sample.json
