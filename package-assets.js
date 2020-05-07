const shell = require('shelljs');

shell.cp('-R', "./source/view", "./build/");
shell.cp("./source/input.js", "./build/input.js");
