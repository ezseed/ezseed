npm i gulp bower pm2 -g
git clone https://github.com/ezseed/ezseed
cd ezseed
npm i
./test/testmode.sh #will replace node_modules by git repos
cd ../web
npm i && bower install && gulp

