const fs = require('fs');
const shell = require('shelljs');

shell.cp('-R', './src/web', './build/');

if (!fs.existsSync('./build/assets')){
    shell.mkdir('./build/assets');
    shell.cp('-R', './assets/icon', './build/assets/icon');
    shell.cp('-R', './assets/tray', './build/assets/tray');
}
