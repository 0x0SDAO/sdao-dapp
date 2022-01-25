#!/bin/bash

cd ~/sdao-dapp/
git stash
git pull
npm install && npm run build
sudo rm -r /var/www/html/sdao-dapp/* && echo "[DEPLOYMENT] : Removed old version"
sudo cp -r ~/sdao-dapp/build/* /var/www/html/sdao-dapp/ && echo "[DEPLOYMENT] : Added new version"
