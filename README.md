# Aliyun-DDNS-TypeScript
阿里云解析DDNS同步脚本TypeScript实现

# How to use?
```shell
git clone https://github.com/Srar/aliyun-ddns-typescript.git
cd aliyun-ddns-typescript
npm install
npm run build
```
将阿里云Api Key与Secret填入`config-sample.json`并重命名为`config.json`放置到`build`文件夹.

使用PM2或类似工具开启`build/app.js`完成部署:
```
mv config-sample.json ./build/config.json
cd ./build/
pm2 start app.js --name ddns
pm2 save
```

你也可以在[release](https://github.com/Srar/aliyun-ddns-typescript/releases)页面下载已打包的版本. 这样就无需安装node环境了.