const settings = require('./settings');
const { app, BrowserWindow } = require('electron');

function createWindow(visibility) {
    return new BrowserWindow({
        width: settings.WindowWidth,
        height: settings.WindowHeight,
        show: visibility,
        title: 'DeezerRPC',
        webPreferences : {
            nodeIntegration: true,
            webviewTag: true,
        }
    });
}

function createMainWindow() {
    let window = createWindow(true);

    window.loadURL(`file://${__dirname}/views/index.html`);
}

app.on('ready', createMainWindow);
