const fs = require('fs');
const shell = require('shelljs');

shell.cp('-R', './src/web', './build/');

if (!fs.existsSync('./build/assets')) {
    shell.mkdir('./build/assets');
    shell.cp('./assets/icon.png', './build/assets/icon.png');
}
